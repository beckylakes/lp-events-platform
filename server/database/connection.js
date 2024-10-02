require('dotenv').config();
const mongoose = require("mongoose")

const URI = process.env.MONGO_URI

const connectDB = async() => {
    try{
        await mongoose.connect(URI)
        .then(console.log("Connected!"))
    } catch(error){
        console.log(error.message)
    }
}

module.exports = connectDB