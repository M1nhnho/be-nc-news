const { selectUsers } = require("../models/users.model.js");

exports.getUsers = (request, response, next) =>
{
    selectUsers()
        .then((users) =>
        {
            response.status(200).send({ users });
        })
        .catch(next);
};