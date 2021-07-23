const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path')
const User = require('./models/userModel')
const routes = require('./routes/route.js');
const cors = require('cors');

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const app = express();

const PORT = process.env.PORT || 5000;

const errorHandler =  (err, req, res, next) => {
     res.status(500).json({ error: err.message });
}
mongoose
    .connect('mongodb://localhost:27017/toptal-housing')
    .then(() => {
        console.log('Connected to the Database successfully');
    });

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(async (req, res, next) => {
    console.log(req.headers)
    if (req.headers["authorization"]) {
        const accessToken = req.headers["authorization"];
        const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
        // Check if token has expired
        if (exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
        }
        res.locals.loggedInUser = await User.findById(userId);
        next();
    } else {
        next();
    }
});

app.use('/', routes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log('Server is listening on Port:', PORT)
})
