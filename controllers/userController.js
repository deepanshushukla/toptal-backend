const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserJson } =  require('../helper/jsonHelper');
const ErrorResponse = require("../helper/errorResponse");
const userClass =  require('../helper/jsonHelper');
const { sendMail } =  require('../helper/mailer');
const MESSAGES = require('../constants/messages');
const STATUS_CODES = require('../constants/statusCodes');
const generatePassword = require('password-generator');

const  hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}
const validatePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
exports.signUp = async (req, res, next) => {
    try {
        const { email, password, role, firstName, lastName, phoneNumber } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const hashedPassword = await hashPassword(password);
            const newUser = new User({email, password: hashedPassword,phoneNumber, firstName, lastName, role: role || "client"});
            const accessToken = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            newUser.accessToken = accessToken;
            await newUser.save();
            res.json({data: new UserJson(newUser,true)})
        } else{
            next(new ErrorResponse(MESSAGES.USER_ALREADY_EXIST, STATUS_CODES.BAD_REQUEST));
        }
    } catch (error) {
        next(error)
    }
};
exports.saveUser = async (req, res, next) => {
    try {
        const { email, role, firstName, lastName, phoneNumber } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const newUser = new User({email, phoneNumber,firstName, lastName, role});
            await newUser.save();
            res.json({data: new UserJson(newUser, false), message:MESSAGES.USER_CREATED_SUCCESSFULLY})

        }else {
            next(new ErrorResponse(MESSAGES.USER_ALREADY_EXIST, STATUS_CODES.BAD_REQUEST));
        }
    } catch (error) {
        next(error)
    }
}
exports.forgotPassword = async (req, res, next) =>{
    //generate 8 digit random token
    const token =  Math.floor(10000000 + Math.random() * 90000000).toString();
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorResponse(MESSAGES.EMAIL_NOT_EXIST, STATUS_CODES.BAD_REQUEST));

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now()+ 3600000; // set expiry for one hour
    user.save((err) => {
        if (err) return next(err);
        const mailOptions = {
            to : email,
            subject : 'Toptal app Password Reset',
            text : `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n
                Please click on the following link, or paste this into your browser to complete the process:\n
                ${req.headers.origin}/auth/resetPassword/${token}\n
                If you did not request this, please ignore this email and your password will remain unchanged.`
        };
        sendMail(mailOptions, () => {
            res.json({data: null, message:MESSAGES.EMAIL_SENT_WITH_TOKEN})
        }, (error) => {
            next(error);
        });
    });
}
exports.resetPassword = async (req, res, next) => {
    const { password ,token } = req.body;
    const user =  await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return next(new ErrorResponse(MESSAGES.RESEAT_TOKEN_INVALID, STATUS_CODES.BAD_REQUEST));
    if (!password) return next(new ErrorResponse(MESSAGES.PASSWORD_MANDATORY, STATUS_CODES.BAD_REQUEST));
    const hashedPassword = await hashPassword(req.body.password);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save((err) => {
        if (err) return next(err);
        res.json({data: null, message:MESSAGES.PASSWORD_CHANGE_SUCCESS})
    });
}
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next(new ErrorResponse(MESSAGES.USER_NOT_FOUND, STATUS_CODES.UNAUTHORIZED_USER));
        if(!user.password) return next(new ErrorResponse(MESSAGES.NEW_ACCOUNT_PASSWORD_RESET, STATUS_CODES.UNAUTHORIZED_USER));
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return next(new ErrorResponse(MESSAGES.WRONG_PASSWORD, STATUS_CODES.UNAUTHORIZED_USER));
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        user.accessToken = accessToken;
        await User.findByIdAndUpdate(user._id, { accessToken });
        res.status(200).json(
            {data: new UserJson(user,true)}
        )
    } catch (error) {
        next(error);
    }
};
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            data: users.map((user)=>new UserJson(user))
        });
    } catch (e){
        next(e)
    }
};
exports.getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) return next(new ErrorResponse(MESSAGES.USER_NOT_FOUND, STATUS_CODES.UNAUTHORIZED_USER));
        res.status(200).json({
            data: new UserJson(user)
        });
    } catch (error) {
        next(error)
    }
};
exports.updateUser = async (req, res, next) => {
    try {
        const update = req.body;
        const userId = req.params.userId;
        await User.findByIdAndUpdate(userId, update);
        const user = await User.findById(userId);
        res.status(200).json({
            data: new UserJson(user),
            message: MESSAGES.USER_DETAILS_UPDATED
        });
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            data: null,
            message: MESSAGES.USER_DELETED_SUCCESS
        });
    } catch (error) {
        next(error)
    }
}

