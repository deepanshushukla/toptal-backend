const express = require('express');
const router = express.Router();
const {signUp, login, allowIfLoggedin, getUser, grantAccess, 
    getUsers, updateUser, deleteUser, saveUser} = require('../controllers/userController');
const {createApartmentDetails, getApartmentDetails} = require('../controllers/apartmentController');

router.post('/signup', signUp);

router.post('/login', login);

router.get('/users/:userId', allowIfLoggedin, getUser);

router.get('/users', allowIfLoggedin,  getUsers);

router.put('/users/:userId', allowIfLoggedin,  updateUser);

router.post('/users', allowIfLoggedin,  saveUser);

router.delete('/users/:userId', allowIfLoggedin,  deleteUser);

router.post('/apartments', allowIfLoggedin, createApartmentDetails);

router.get('/apartments', allowIfLoggedin, getApartmentDetails);

module.exports = router;