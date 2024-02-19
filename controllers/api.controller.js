const { selectAPIEndpoints } = require("../models/api.model.js");

exports.getAPIEndpoints = (request, response, next) =>
{
    selectAPIEndpoints()
        .then((endpoints) =>
        {
            response.status(200).send({ endpoints });
        })
        .catch(next);
};