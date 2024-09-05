const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
});
const user = mongoose.model('user',UserSchema);
user.createIndexes();
module.exports = user;