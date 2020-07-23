const express = require('express');
const { body } = require('express-validator');

const formController = require("../controllers/form");
const isAuth = require('../middleware/is-auth')

const router = express.Router();

// /GET /api/form
router.get('/events', formController.getPosts);

// POST /api/register
router.post('/register', isAuth, [
    body('ename').trim().isLength({max : 30}),
    body('evenue').trim().isLength({max : 80}),
    body('description').trim().isLength({min : 50})
] , formController.register);

router.get('/event/:eventId', formController.singlepost);

router.put('/updateevent/:eventId',[
    body('ename').trim().isLength({max : 30}),
    body('evenue').trim().isLength({max : 80}),
    body('description').trim().isLength({min : 50})
] ,formController.updateevent);

router.delete('/deleteevent/:eventId', formController.deleteevent);

module.exports = router;