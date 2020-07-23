const mongoose = require('mongoose');
const schema = mongoose.Schema;

const regisSchema = new schema ({
    ename: {
        type:String,
        required:true,
    },
    imagePath: {
        type:String,
        required:true,
    },
    category: {
        type:String,
        required:true,
    },
    date: {
        type:String,
        required:true,
    },
    evenue: {
        type:String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    creator: {
        type: schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
},
{ timestamps:true }
);

module.exports = mongoose.model('Register', regisSchema);