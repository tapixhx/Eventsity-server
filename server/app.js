const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const formRoutes = require('./routes/form');
const userRoutes = require('./routes/auth');
const murl = require('./config');

const app = express();

app.use(bodyParser.json()); //application/json

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
    res.status(status).json({message:message, data: data});
});

mongoose.connect(
    murl
)
.then(result =>
    app.listen(8080),   
)
.catch(err=>console.log(err));