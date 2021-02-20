const express = require('express')
const router = express.Router()
const dbUser = require('./dbUser')
const bodyParser = require('body-parser')

router.post('/login', bodyParser.json(), function (req, res, next) {
    console.log('login post: ', req.body)
    res.setHeader('Content-Type','application/json;charset=utf-8')
    dbUser.findOne(req.body, function (err, data) {
        if (err) { return console.log(err) }
        if (data) {
            req.session.uid = data._id
            req.session.cookie.maxAge = 60 * 60 * 1000
            // console.log('req sess: ', req.session)
            res.send({
                isLoginSuccess: 'yes',
                id: data._id,
                headUrl: data.headUrl
            })
        } else {
            res.send({
                isLoginSuccess: 'no'
            })
        }
    })
})


router.get('/checkLogin', function (req, res, next) {
    if (req.session.uid && req.session.uid == '5ffff5a63815e91c186c3f46') {
        res.send('login')
        next()
    } else {
        res.send(' Not logged in ')
    }
})

router.get('/register', function (req, res, next) {
    console.log('register get: ', req.query)
    res.send('注册功能已关闭')
    return
    let register = new dbUser({
        account: req.query.account,
        pass: req.query.pass,
        headUrl: '0'
    })
    let resText = 'server error'
    res.setHeader('Content-Type','text/plain;charset=utf-8')
    dbUser.findOne({ 'account': req.query.account }, function (err, data) {
        if (err) { return console.log(err) }
        if (data) {
            resText = '账号已被注册'
            res.write(resText)
            res.end()
        } else {
            register.save(function (err, data) {
                if (err) return console.log(err)
                resText = '注册成功'
                res.write(resText)
                res.end()
            })
        }
    })
})

module.exports = router;