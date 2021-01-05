const express = require('express');
const { body } = require('express-validator');

const formController = require("../controllers/form");
const isAuth = require('../middleware/is-auth')
const Multer = require('multer');

const router = express.Router();

const multerStore = Multer({
    storage: Multer.memoryStorage(),
})

// /GET /api/form
router.get('/events', formController.getPosts);

// POST /api/register
router.post('/register', isAuth, multerStore.single('imagePath'),[
    body('ename').trim().isLength({max : 30}),
    body('evenue').trim().isLength({max : 80}),
    body('description').trim().isLength({min : 50}),
] , formController.register);

router.get('/event/:eventId', formController.singlepost);

router.get('/update/:eventId', isAuth, formController.updatepost);

router.put('/updateevent/:eventId', isAuth, [
    body('ename').trim().isLength({max : 30}),
    body('evenue').trim().isLength({max : 80}),
    body('description').trim().isLength({min : 50})
] ,formController.updateevent);

router.delete('/deleteevent/:eventId', isAuth, formController.deleteevent);

router.get('/userevents', isAuth, formController.userevent);

module.exports = router;