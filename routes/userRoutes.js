const usersRouter = require("express").Router();
const {signUp, login, getUser, grantAccess,
    getUsers, updateUser, deleteUser,
    saveUser, forgotPassword, resetPassword} = require('../controllers/userController');
const {allowIfLoggedin} = require('../controllers/utilController');

usersRouter.post('/signup', signUp);

usersRouter.post('/login', login);

usersRouter.post('/forgotPassword', forgotPassword);

usersRouter.post('/resetPassword', resetPassword);

usersRouter.get('/:userId', allowIfLoggedin, getUser);

usersRouter.put('/:userId', allowIfLoggedin,  updateUser);

usersRouter.delete('/:userId', allowIfLoggedin,  deleteUser);

usersRouter.get('/', allowIfLoggedin,  getUsers);

usersRouter.post('/', allowIfLoggedin,  saveUser);

module.exports = usersRouter;

