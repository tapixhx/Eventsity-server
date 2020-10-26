const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Otp = require("../models/otp");
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');
const key = require('../config2');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: key
    }
}));

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed');
        errors.statusCode = 422;
        errors.data = errors.array();
        throw errors;
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
    .then(hashedpw => {
        const user = new User({
            email: email,
            password: hashedpw,
            name: name,
        });
        return user.save();
    })
    .then(result => {
        const userOtp = new Otp({
            otp: otp,
            userId: result
        })
        userOtp.save();

        transporter.sendMail ({
            to: email,
            from: 'eventsity@india.com',
            subject: 'Welcometo eventsity! Confirm your email',
            html: `<h1>Thanks for signing up with Eventsity</h1>
                    <h4>Here is your otp - ${otp}</h4>`
        });

        setTimeout(() => {
            Otp.findByIdAndRemove(userOtp._id, err => next(err))
        }, 200000);

        res.status(201).json({message: 'User Created!', userId: result._id})
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
    .then(user => {
        if(!user) {
            const error = new Error('User already exist');
            error.statusCode(401);
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if(!isEqual) {
            const error = new Error('Wrong Password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            'privatekey',
            { expiresIn:'12h' }
        );
        res.status(200).json({token: token,name: loadedUser.name , userId: loadedUser._id.toString()});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.otpVerify = (req, res, next) => {

    const userId = req.params.userId;
    const userOtp = req.body.otp;
    let user;

    // if(!userId){
    //     return;
    // }

    console.log(userOtp);
    
    User.findById(userId)
    .then(loggedUser => {

        user = loggedUser;

        if (!loggedUser) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        if(loggedUser.isVerified) {
            const error = new Error('User is already verified.');
            error.statusCode = 406;
            throw error;
        }

    return Otp.findOne({ userId: userId });
    })
    .then(otp => {

        console.log(userOtp);
        console.log(otp.otp);

        if (!otp) {
            const error = new Error('Otp expired!');
            error.statusCode = 400;
            throw error;
        }

        const isEqual = userOtp===otp.otp;

        if (!isEqual) {
            const error_1 = new Error('Wrong otp!');
            error_1.statusCode = 401;
            throw error_1;
        }
                const token = jwt.sign({
                    email: user.email,
                    userId: user.id.toString()
                }, 'privatekey', { expiresIn: '12h' });
                user.isVerified= true;
                user.save();
        
                Otp.findOneAndRemove({ userId: user}, err => next(err));
                res.status(200).json({ message: 'User verified', token: token, userId: user.id, name: user.name ,email: user.email});
    })    
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
    next(err);
    });
}

exports.otpResend = (req, res, next) => {

    const userId = req.params.userId;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(otp);
    User.findById(userId)
    .then(user => {

        Otp.findOneAndRemove({ userId: userId }, err => next(err));
                
        const userOtp = new Otp({
            otp: otp,
            userId: user
        });
        userOtp.save();

        transporter.sendMail ({
            to: email,
            from: 'eventsity@india.com',
            subject: 'Welcometo eventsity! Confirm your email',
            html: `<h1>Thanks for signing up with Eventsity</h1>
                    <h4>Here is your otp - ${otp}</h4>`
        });

        setTimeout(() => {
            Otp.findByIdAndRemove(userOtp._id, err => next(err))
        }, 200000);

        res.status(201).json({ message: 'Otp resent'})
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}