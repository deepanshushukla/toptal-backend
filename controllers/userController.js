const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userClass =  require('../helper/userClass');
const { sendMail } =  require('../helper/mailer');
var generatePassword = require('password-generator');

const  hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}
const validatePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

const UserJson = userClass.UserJson;

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
            next(new Error("User Already Exists"))
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
            const tempPassword = generatePassword();
            const mailOptions = {
                to : email,
                subject : 'Your account password',
                text : `Your password is ${tempPassword}`
            };
            console.log(mailOptions)
            const hashedPassword = await hashPassword(tempPassword);
            console.log(hashedPassword)
            const newUser = new User({email, phoneNumber, password: hashedPassword,firstName, lastName, role});
            await newUser.save();
            sendMail(mailOptions, () => {
                res.json({data: new UserJson(newUser, false),message:'Email has been Sent with password'})
            }, (error) => {
                console.log(error)
                next(error);
            });
        }else {
            next(new Error("User Already Exists"))
        }
    } catch (error) {
        next(error)
    }
}
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next(new Error('Email does not exist'));
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return next(new Error('Password is not correct'))
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
        if (!user) return next(new Error('User does not exist'));
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
        const user = await User.findById(userId)
        res.status(200).json({
            data: new UserJson(user),
            message: 'User has been updated'
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
            message: 'User has been deleted'
        });
    } catch (error) {
        next(error)
    }
}
exports.grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
};
exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user)
            return res.status(401).json({
                error: "You need to be logged in to access this route"
            });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
