const { selectUsers, selectUserByUsername } = require("../models/users.model.js");

exports.getUsers = (request, response, next) =>
{
    selectUsers()
        .then((users) =>
        {
            response.status(200).send({ users });
        })
        .catch(next);
};

exports.getUserByUsername = (request, response, next) =>
{
    const { username } = request.params;
    selectUserByUsername(username)
        .then((user) =>
        {
            response.status(200).send({ user });
        })
        .catch(next);
};