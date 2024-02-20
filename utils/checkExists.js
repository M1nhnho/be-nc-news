const format = require('pg-format');
const db = require('../db/connection.js');

exports.checkExists = (table, column, value) =>
{
    return new Promise((resolve, reject) =>
    {
        const queryStr = format('SELECT * FROM %I WHERE %I = %L;', table, column, value);
        db.query(queryStr)
            .then(({ rows }) =>
            {
                if (rows.length === 0)
                {
                    return reject({ status: 404, msg: 'Not Found' });
                }
                return resolve();
            })
            .catch((error) =>
            {
                return reject(error);
            });
    });
}