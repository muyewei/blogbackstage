const mongoose = require('./db')

var blogSchema = mongoose.Schema({
    title: String,
    precontent: String,
    writer: String,
    wdate: String,
    tags: String,
    main: String,
    totalComments: Number
}) 

module.exports = mongoose.model('blog', blogSchema)