const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const formRoutes = require('./routes/form');
const userRoutes = require('./routes/auth');
const murl = require('./config');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg') {
            cb(null, true);
    }
    else {
        cb(null, false);
    }
}

app.use(bodyParser.json()); //application/json
app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/api', formRoutes);
app.use('/auth', userRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    const data = error.data;
    const userId = error.userId;
    if(!userId) {
        res.status(status).json({message: message, data: data});
        console.log("11");
    } 
    else {
        res.status(status).json({message: message, data: data, userId: userId});
        console.log("22");
    }
});

mongoose.connect(
    murl
)
.then(result =>
    app.listen(8080),   
)
.catch(err=>console.log(err));