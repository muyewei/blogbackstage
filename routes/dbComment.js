const mongoose = require('./db')

var commentSchema = mongoose.Schema({
    img: String,
    user: String,
    cdate: String,
    quote: String,
    comment: String,
    email: String,
    blog: String,
    articleId: String
})

module.exports = mongoose.model('comment', commentSchema)