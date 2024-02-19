const db = require('../db/connection.js');

exports.selectArticles = () =>
{
    return db.query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
            FROM articles LEFT JOIN comments
                ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`)
        .then(({ rows }) =>
        {
            return rows;
        });
};

exports.selectArticleByID = (articleID) =>
{
    return db.query(
        `SELECT *
            FROM articles
            WHERE article_id = $1;`,
        [articleID])
        .then(({ rows }) =>
        {
            if (rows.length === 0)
            {
                return Promise.reject({ status: 404, msg: 'Not Found' });
            }
            return rows[0];
        });
};