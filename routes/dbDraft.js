const mongoose = require('./db')

var draftSchema = mongoose.Schema({
    title: String,
    precontent: String,
    tags: String,
    main: String
})

module.exports = mongoose.model('draft', draftSchema)