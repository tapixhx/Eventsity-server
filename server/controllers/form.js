const { validationResult } = require('express-validator');

const Register = require('../models/register');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
    Register.find()
    .then(register => {
        res.status(200).json({message:'Fetched Events', events: register})
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.register = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    const ename = req.body.ename;
    const imagePath = req.body.imagePath;
    const category = req.body.category;
    const evenue = req.body.evenue;
    const description = req.body.description;
    const date = req.body.date;
    let creator;
    // Create db
    const register = new Register({
        ename: ename,
        imagePath: imagePath,
        category: category,
        evenue: evenue,
        description: description,
        date: date,
        creator: req.userId,
    });
    register.save()
    .then(result => {
        return User.findById(req.userId);
    })
    .then(user => {
        creator = user;
        user.events.push(register);
        return user.save();
        console.log(result);
    })
    .then(result => {
        res.status(201).json({
            message:"Post created successfully",
            post: register,
            creator: {_id: creator._id, name: creator.name }
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.singlepost = (req, res, next) => {
    const eventId = req.params.eventId;
    Register.findById(eventId)
    .then(event => {
        if(!event) {
            const error = new Error ('Could not find event');
            error.statusCode = 404;
            throw error; //throws error to catch block
        }
        res.status(200).json({message:'Event fetched', event: event});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.updateevent = (req, res, next) => {
    const eventId = req.params.eventId;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    const ename = req.body.ename;
    const imagePath = req.body.imagePath;
    const category = req.body.category;
    const evenue = req.body.evenue;
    const description = req.body.description;
    const date = req.body.date;

    Register.findById(eventId)
    .then(event => {
        if(!event) {
            const error = new Error ('Could not find event');
            error.statusCode = 404;
            throw error; //throws error to catch block
        }
        if(event.creator.toString() !== req.userId) { //check logged in user
            const error = new Error('Not Authenticated');
            error.statusCode = 403;
            throw error;
        }
        event.ename = ename;
        event.imagePath = imagePath;
        event.category = category;
        event.evenue = evenue;
        event.description = description;
        event.date = date;
        return event.save();
    })
    .then(result => {
        res.status(200).json({message: 'Event updated', event:result})
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.deleteevent = (req, res, next) => {
    const eventId = req.params.eventId;
    Register.findById(eventId)
    .then(event => {
        if(!event) {
            const error = new Error ('Could not find event');
            error.statusCode = 404;
            throw error; //throws error to catch block
        }
        if(event.creator.toString() !== req.userId) {
            const error = new Error('Not Authenticated');
            error.statusCode = 403;
            throw error;
        }
        //chk logged in user
        return Register.findByIdAndRemove(eventId);
    })
    .then(result => {
        return User.findById(req.userId);
    })
    .then(user => {
        user.event.pull(eventId);
        return user.save();
        
    })
    .then(result => {
        // console.log(result);
        res.status(200).json({message: 'Deleted Post!'});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.userevent = (req, res, next) => {
    return User.findById(req.userId)
    .select('events -_id')
    .populate('events').exec(
        err,events => {
            res.status(201).json({message:'User event fetched', eventss : events});
        }
    )



    // .then(user => {
    //     if(!user) {
    //         const error = new Error ('Could not find user!');
    //         error.statusCode = 404;
    //         throw error; //throws error to catch block
    //     }
    //     // res.status(200).json({message:'User events fetched!', user:user});
    //     let i, userevents=[];
    //     console.log(user.events);
    //     for(i=user.events[0]; i<user.events.length; i++) {
    //         Register.findById(user.events[i])
    //         .then(event => {
    //             res.status(200).json({message:'Fetched Events', events: event})
    //         })
    //     }
    //     // res.status(200).json({message:'User events fetched!', userevents: userevents});
    // })
    // .catch(err => {
    //     if(!err.statusCode) {
    //         err.statusCode = 500;
    //     }
    //     next(err);
    // });
}