const endpointsData = require('../endpoints.json');

exports.selectAPIEndpoints = () =>
{
    return Promise.resolve(endpointsData);
};