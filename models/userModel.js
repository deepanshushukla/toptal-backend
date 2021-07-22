const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'client',
        enum: ["admin", "realtor", "client"]
    },
    accessToken: {
        type: String
    }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;