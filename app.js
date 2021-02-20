const express = require('express')
const app = express()
const ssession = require('express-session')
const path = require('path')

const user = require('./routes/user')
const blog = require('./routes/blog')
const index = require('./routes/index')

app.get('/', function (req, res) {
    res.send('hello world')
})

app.use(ssession({
    secret: 'moranblog',
    resave: false,
    saveUninitialized: true
}))

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/user', user)
app.use('/blog', blog)
app.use('/index', index)

app.listen(1000, function () {
    console.log('app listen in port: 1000')
})


