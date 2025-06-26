const mongoose = require('mongoose')

const emailServiceSchema1 = mongoose.Schema({
    userName : String,
    serviceName : String,
    to : String,
    subject : String,
    body : String,
    schedule : String,
    targetCount : String,
    status : Number,
    lastUpdated : String
})

module.exports = mongoose.model("emailService1",emailServiceSchema1)