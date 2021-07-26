const express = require('express');
const router = express.Router();
const {signUp, login, allowIfLoggedin, getUser, grantAccess, 
    getUsers, updateUser, deleteUser, saveUser, forgotPassword, resetPassword} = require('../controllers/userController');
const {createApartments, getApartments,deleteApartment,updateApartment} = require('../controllers/apartmentController');

router.post('/signup', signUp);

router.post('/login', login);

router.post('/users/forgotPassword', forgotPassword);

router.post('/users/resetPassword', resetPassword);

router.get('/users/:userId', allowIfLoggedin, getUser);

router.get('/users', allowIfLoggedin,  getUsers);

router.put('/users/:userId', allowIfLoggedin,  updateUser);

router.post('/users', allowIfLoggedin,  saveUser);

router.delete('/users/:userId', allowIfLoggedin,  deleteUser);

router.post('/apartments', allowIfLoggedin, createApartments);

router.get('/apartments', allowIfLoggedin, getApartments);

router.delete('/apartments/:id', allowIfLoggedin,  deleteApartment);

router.put('/apartments/:id', allowIfLoggedin,  updateApartment);



module.exports = router;