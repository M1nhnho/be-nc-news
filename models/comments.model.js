const db = require('../db/connection.js');
const { checkExists } = require('../utils/checkExists.js');

exports.selectCommentsByArticleID = (articleID) =>
{
    const promises =
    [
        db.query(
            `SELECT *
                FROM comments
                WHERE article_id = $1
                ORDER BY created_at DESC;`,
            [articleID]
        ),
        checkExists('articles', 'article_id', articleID)
    ];

    return Promise.all(promises)
        .then(([{ rows }]) =>
        {
            return rows;
        });
};

exports.insertCommentAtArticleID = (username, body, articleID) =>
{
    return db.query(
            `INSERT INTO comments
                (body, author, article_id, votes, created_at)
                VALUES
                    ($1, $2, $3, $4, $5)
                RETURNING *;`,
            [body, username, articleID, 0, new Date(Date.now())]
        )
        .then(({ rows }) =>
        {
            return rows[0];
        });
};

exports.updateCommentByID = (incVotes, commentID) =>
{
    return db.query(
            `UPDATE comments
                SET votes = votes + $1
                WHERE comment_id = $2
                RETURNING *;`,
            [incVotes, commentID]
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

exports.removeCommentByID = (commentID) =>
{
    return db.query(
            `DELETE FROM comments
                WHERE comment_id = $1
                RETURNING *;`,
            [commentID]
        )
        .then(({ rows }) =>
        {
            if (rows.length === 0)
            {
                return Promise.reject({ status: 404, msg: 'Not Found' });
            }
        });
};