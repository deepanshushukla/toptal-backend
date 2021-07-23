const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Apartment = Schema({
    apartmentName: {
        type: String,
        required: true,
        trim: true
    },
    apartmentDescription: {
        type: String,
        required: true,
        trim: true
    },
    floorAreaSize: {
        type: Number,
        required: true,
        trim: true
    },
    pricePerMonth: {
        type: Number,
        required: true,
        trim: true
    },
    numberOfRooms: {
        type: Number,
        required: true,
        trim: true
    },
    geoLocation: {
        type: String,
        required: true,
        trim: true
    },
    isSold: {
        type: Boolean,
        required: true,
        trim: true,
        default: false
    },
    owner: {type: mongoose.Schema.ObjectId, ref: 'user'}
},{timestamps : true});

const User = mongoose.model('apartment', Apartment);

module.exports = User;