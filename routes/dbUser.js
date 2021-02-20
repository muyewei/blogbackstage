const mongoose = require('./db.js')

var UserSchema = mongoose.Schema({
    account: String,
    pass: String,
    headUrl: String
})

module.exports = mongoose.model('user', UserSchema)

