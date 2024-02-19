const fs = require('fs/promises');

exports.selectAPIEndpoints = () =>
{
    return fs.readFile(`${__dirname}/../endpoints.json`, 'utf8');
}