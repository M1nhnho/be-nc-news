const endpointsData = require('../endpoints.json');

exports.selectAPIEndpoints = () =>
{
    return Promise.resolve(JSON.stringify(endpointsData));
};