const db = require('../db/connection.js');
const { checkExists } = require('../utils/checkExists.js');
const format = require('pg-format');

exports.selectArticles = (topicValue = '%', sortBy = 'created_at', order = 'DESC', limit = 10, page = 1) =>
{
    // Order whitelist
    const validOrders = ['ASC', 'DESC'];
    if (!validOrders.includes(order.toUpperCase()))
    {
        return Promise.reject({ status: 400, msg: 'Bad Request' });
    }
    const offset = (page-1) * limit;

    const queryString =
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
            FROM articles LEFT JOIN comments
                ON articles.article_id = comments.article_id
            WHERE articles.topic LIKE %L
            GROUP BY articles.article_id
            ORDER BY %I %s `;
    const selectQueryString = format(queryString, topicValue, sortBy, order);
    const limitQueryString = format(queryString + `LIMIT %L OFFSET %L;`, topicValue, sortBy, order, limit, offset);

    const promises = [db.query(selectQueryString), db.query(limitQueryString)];

    if (topicValue !== '%')
    {   // If there is a topic query, check topic exists
        promises.push(checkExists('topics', 'slug', topicValue))
    }

    return Promise.all(promises)
        .then(([{ rows: fullRows }, { rows: limitedRows }]) =>
        {
            if (fullRows.length === 0)
            {   // Ignoring pagination, check if a query results in no matches (only topic at the moment results in this behaviour)
                return [limitedRows, 0];
            }
            else if (limitedRows.length === 0)
            {   // Otherwise, there are matches so check if the queried page is empty
                return Promise.reject({ status: 404, msg: 'Not Found' });
            }
            return [limitedRows, fullRows.length];
        });
};

exports.insertArticle = (requestBody) =>
{
    const { author, title, body, topic, article_img_url = 'DEFAULT' } = requestBody;
    const percentCharacter = article_img_url === 'DEFAULT' ? '%s' : '%L'

    const queryString = format(
        `INSERT INTO articles
            (title, topic, author, body, created_at, votes, article_img_url)
            VALUES
                (%L, %L, %L, %L, DEFAULT, DEFAULT, ${percentCharacter})
            RETURNING *, 0 AS comment_count;`,
        title, topic, author, body, article_img_url
    )
    
    return db.query(queryString)
        .then(({ rows }) =>
        {
            return rows[0];
        });
};

exports.selectArticleByID = (articleID) =>
{
    return db.query(
            `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
                FROM articles LEFT JOIN comments
                    ON articles.article_id = comments.article_id
                WHERE articles.article_id = $1
                GROUP BY articles.article_id;`,
            [articleID]
        )
        .then(({ rows }) =>
        {
            if (rows.length === 0)
            {
                return Promise.reject({ status: 404, msg: 'Not Found' });
            }
            return rows[0];
        });
};

exports.updateArticleByID = (incVotes, articleID) =>
{
    return db.query(
            `UPDATE articles
                SET votes = votes + $1
                WHERE article_id = $2
                RETURNING *;`,
            [incVotes, articleID]
        )
        .then(({ rows }) =>
        {
            if (rows.length === 0)
            {
                return Promise.reject({ status: 404, msg: 'Not Found' });
            }
            return rows[0];
        });
};

exports.removeArticleByID = (articleID) =>
{
    return db.query(
            `DELETE FROM articles
                WHERE article_id = $1
                RETURNING *;`,
            [articleID]
        )
        .then(({ rows }) =>
        {
            if (rows.length === 0)
            {
                return Promise.reject({ status: 404, msg: 'Not Found' });
            }
        });
};