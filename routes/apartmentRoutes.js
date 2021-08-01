const apartmentRouter = require("express").Router();
const {createApartments, getApartments,deleteApartment,updateApartment} = require('../controllers/apartmentController');
const {allowIfLoggedin} = require('../controllers/utilController');

apartmentRouter.delete('/:id', allowIfLoggedin,  deleteApartment);

apartmentRouter.put('/:id', allowIfLoggedin,  updateApartment);

apartmentRouter.post('/', allowIfLoggedin, createApartments);

apartmentRouter.get('/', allowIfLoggedin, getApartments);

module.exports = apartmentRouter;
