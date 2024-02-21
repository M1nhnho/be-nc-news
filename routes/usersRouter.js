const usersRouter = require('express').Router();
const { getUsers, getUserByUsername } = require('../controllers/users.controller.js');

usersRouter.get('/', getUsers);
usersRouter.get('/:username', getUserByUsername);

module.exports = usersRouter;