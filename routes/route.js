const express = require('express');
const router = express.Router();
const {signUp, login, allowIfLoggedin, getUser, grantAccess, getUsers, updateUser, deleteUser} = require('../controllers/userController');

router.post('/signup', signUp);

router.post('/login', login);

router.get('/user/:userId', allowIfLoggedin, getUser);

router.get('/users', allowIfLoggedin, grantAccess('readAny', 'profile'), getUsers);

router.put('/user/:userId', allowIfLoggedin, grantAccess('updateAny', 'profile'), updateUser);

router.delete('/user/:userId', allowIfLoggedin, grantAccess('deleteAny', 'profile'), deleteUser);

module.exports = router;