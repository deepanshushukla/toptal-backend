const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;
const AddressSchema = Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    pinCode:{
        type: Number,
        required: true,
        trim: true
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
});
const GeoLocation =  Schema({
    lat:Number,
    long:Number
});
const ApartmentSchema = Schema({
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
    geoLocation: GeoLocation,
    address: AddressSchema,
    isRented: {
        type: Boolean,
        required: true,
        trim: true,
        default: false
    },
    owner: {type: Schema.ObjectId, ref: 'user'}

},{timestamps : true});
ApartmentSchema.plugin(mongoosePaginate);
const Apartment = mongoose.model('apartment', ApartmentSchema);

module.exports = Apartment;