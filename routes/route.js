const express = require('express');
const router = express.Router();
const {signUp, login, allowIfLoggedin, getUser, grantAccess, getUsers, updateUser, deleteUser} = require('../controllers/userController');

router.post('/signup', signUp);

router.post('/login', login);

router.get('/user/:userId', allowIfLoggedin, getUser);

router.get('/users', allowIfLoggedin,  getUsers);

router.put('/user/:userId', allowIfLoggedin,  updateUser);

router.delete('/user/:userId', allowIfLoggedin,  deleteUser);

module.exports = router;