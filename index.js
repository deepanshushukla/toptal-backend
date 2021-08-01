const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path')
const User = require('./models/userModel')
const routes = require('./routes');
const errorHandler = require('./helper/error');
const cors = require('cors');
const MESSAGES = require('./constants/messages');
const STATUS_CODES = require('./constants/statusCodes');
const ErrorResponse = require("./helper/errorResponse");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const app = express();

const PORT = process.env.PORT || 5000;

// const errorHandler =  (err, req, res, next) => {
//      res.status(500).json({ message: err.message });
// };
mongoose
    .connect('mongodb://localhost:27017/toptal-housing')
    .then(() => {
        console.log('Connected to the Database successfully');
    });

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(async (req, res, next) => {
    if (req.headers["authorization"]) {
        const accessToken = req.headers["authorization"];
        try {
            const {userId, exp} = await jwt.verify(accessToken, process.env.JWT_SECRET);

            // Check if token has expired
            if (exp < Date.now().valueOf() / 1000) {
                return next(new ErrorResponse(MESSAGES.TOKEN_EXPIRED, STATUS_CODES.UNAUTHORIZED_USER));
            }
            const user = await User.findById(userId);
            if(!user){
                return next(new ErrorResponse(MESSAGES.NO_USER_WITH_TOKEN, STATUS_CODES.UNAUTHORIZED_USER));
            }
            res.locals.loggedInUser = await User.findById(userId);
            next();
        }catch(e){
            return next(new ErrorResponse(MESSAGES.TOKEN_EXPIRED, STATUS_CODES.UNAUTHORIZED_USER));
        }
    } else {
        next();
    }
});
app.use("/users", routes.users);
app.use("/apartments", routes.apartment);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log('Server is listening on Port:', PORT)
})
