const mongoose = require('mongoose')
const mongoURI = "mongodb://localhost:27017/notebook"

const connectto = async()=>{
    try {
        mongoose.connect(mongoURI);
        console.log("Connected");
    } catch (error) {
        console.log("Error")
    }
}

module.exports = connectto;