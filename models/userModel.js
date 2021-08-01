const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ROLES = require('../constants/userRoles');
const UserSchema = Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber:{
        type: Number,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: ROLES.CLIENT,
        enum: [ROLES.ADMIN, ROLES.REALTOR, ROLES.CLIENT]
    },
    accessToken: {
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
},{timestamps : true});

const User = mongoose.model('user', UserSchema);

module.exports = User;