const db = require('../db/connection.js');
const { checkExists } = require('../utils/checkExists.js');
const format = require('pg-format');

exports.selectArticles = (topicValue = '%', sortBy = 'created_at', order = 'DESC') =>
{
    // Order whitelist
    const validOrders = ['ASC', 'DESC'];
    if (!validOrders.includes(order.toUpperCase()))
    {
        return Promise.reject({ status: 400, msg: 'Bad Request' });
    }

    const queryString = format(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
            FROM articles LEFT JOIN comments
                ON articles.article_id = comments.article_id
            WHERE articles.topic LIKE %L
            GROUP BY articles.article_id
            ORDER BY %I %s;`,
        topicValue, sortBy, order
    )
    const promises = [db.query(queryString)];

    if (topicValue !== '%')
    {   // If there is a topic query, check topic exists
        promises.push(checkExists('topics', 'slug', topicValue))
    }

    return Promise.all(promises)
        .then(([{ rows }]) =>
        {
            return rows;
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