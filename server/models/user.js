const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    name : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required : true
    },
    password : {
        type:String,
        required:true
    },
    status : {
        type:String,
        default: 'I am new',
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    events: [
        {
            type:schema.Types.ObjectId,
            ref: 'Register'
        }
    ]
})

module.exports = mongoose.model('User',userSchema);