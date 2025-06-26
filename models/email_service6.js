const mongoose = require('mongoose')

const emailServiceSchema6 = mongoose.Schema({
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

module.exports = mongoose.model("emailService6",emailServiceSchema6)