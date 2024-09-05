const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose')
const { Schema } = mongoose;

const NoteSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title :{
        type: String,
        required: true
    },
    description:{
        type: String,
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    },
});
// const user = mongoose.model('user',UserSchema);
// user.createIndexes();
module.exports = mongoose.model('note',NoteSchema);