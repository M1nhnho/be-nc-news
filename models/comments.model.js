const db = require('../db/connection.js');
const { checkExists } = require('../utils/checkExists.js');

exports.selectCommentsByArticleID = (articleID, limit = 10, page = 1) =>
{
    const offset = (page-1) * limit;
    const queryString =
        `SELECT *
            FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC `;

    const promises =
    [
        db.query(queryString, [articleID]),
        db.query(queryString + `LIMIT $2 OFFSET $3;`, [articleID, limit, offset]),
        checkExists('articles', 'article_id', articleID)
    ];
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

exports.insertCommentAtArticleID = (requestBody, articleID) =>
{
    const { username, body } = requestBody;
    return db.query(
            `INSERT INTO comments
                (body, author, article_id, votes, created_at)
                VALUES
                    ($1, $2, $3, DEFAULT, DEFAULT)
                RETURNING *;`,
            [body, username, articleID]
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