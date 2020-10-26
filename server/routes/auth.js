const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth')

const router = express.Router();

router.post('/signup', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid Email')
    .custom((value, { req }) => {
        return User.findOne({email:value}).then(userDoc => {
            if(userDoc) {
                return Promise.reject('E-mail address already exist!')
            }
        });
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({min : 6}),
    body('name')
    .trim()
    .not()
    .isEmpty(),
], authController.signup
);

router.post('/login', authController.login);

router.post("/otpVerify/:userId", authController.otpVerify);

router.get("/otpResend/:userId", authController.otpResend);

module.exports = router;