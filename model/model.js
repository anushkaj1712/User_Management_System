const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,  
    },
    age: {
        type: Number,      
    }, 
    email: {
        type: String,
    },
    phoneNumber: {
        type: Number, 
    },
    password: {
        type: String,
        // required: true,
    },
    otp: {
        type: String,
      },
    otpExpiry: {
        type: Date,
    },
    otpverify: {
        type: Boolean,
        default: false,
    },  
    newPassword: {
        type: String,
    },  
    profilePicture: {
        type: [],
    },

});
const user = mongoose.model('user', userSchema);
module.exports = user;