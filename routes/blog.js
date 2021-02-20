const express = require('express')
const router = express.Router()
const dbBlog = require('./dbBlog')
const dbDraft = require('./dbDraft')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')
const fs = require('fs')
const basic = require('../basic')

router.post('/uploadArticle', bodyParser.json(), function (req, res, next) {
    if (req.session.uid && req.session.uid == '5ffff5a63815e91c186c3f46') { 
        let blogData = req.body.blog
        console.log(blogData)
        blogData.writer = '邓炜标'
        let n = new Date()
        blogData.wdate = n.getFullYear() + '/' + (n.getMonth() + 1) + '/' + n.getDate()
        blogData.totalComments = 0
        delete blogData.type
        console.log(blogData)
        let blog = new dbBlog(blogData)
        blog.save(function (err, data) {
            if (err) return console.log(err)
            else {
                console.log(data)
                res.send('upblogsuccess')
            }
        })
    } else {    
        res.send('用户凭证失效，请重新登录')
        return
    }
})

router.post('/uploadDraft', bodyParser.json(), function (req, res, next) {
    if (req.session.uid && req.session.uid == '5ffff5a63815e91c186c3f46') { 
        let draftData = req.body.draft
        delete draftData.type
        let draft = new dbDraft(draftData)
        draft.save(function (err, data) {
            if (err) return console.log(err)
            else {
                console.log(data)
                res.send('savedraftsuccess')
            }
        })
    } else {    
        res.send('用户凭证失效，请重新登录')
        return
    }
})

router.post('/uploadimages', function (req, res) {
    var n = new Date();
    var imagesArr = []
    // 解析一个文件上传  
   var form = new multiparty.Form();  
   //设置编辑  
   form.encoding = 'utf-8';  
   //设置文件存储路径  
    var dir = "./public";
    form.uploadDir = dir;  
    //设置单文件大小限制  
    form.maxFilesSize = 2000 * 1024 * 1024;  
    form.parse(req, function (err, fields, files) {
        if (err) return console.log(err)
        var counter = 0
        Object.keys(files).forEach(function (name) {
            var file = files[ name ][ 0 ]
            var ndate = n.getFullYear() + (n.getMonth() < 9 ? '0' : '') + (n.getMonth() + 1)
            var dstPath = "public/" + ndate + "/" + file.path.split('\\')[ 1 ];
            imagesArr.push([name, basic.url + 'static/' + ndate + "/" + file.path.split('\\')[ 1 ]])
            new Promise((resolve, reject) => {
                fs.stat("./public/" + ndate, (err, stats) => {
                    if (err) {
                        console.log(err)
                        fs.mkdir("./public/" + ndate, err => {
                            if (err) resolve('mkdir fail')
                            else {
                                resolve('mkdir success')
                            }
                        })
                    } else {
                        resolve()
                    }
                })
            }).then(() => {
                fs.rename(file.path, "./" + dstPath, function (err) {
                    if (err) {
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                    counter++;
                    if (counter === Object.keys(files).length) {
                        // console.log("imgsarr:", imagesArr)
                        res.send(imagesArr)
                      }
                });
            })
 
        })
    })
})

router.get('/adminGetCommentsList', function (req, res, next) {
    
})

router.get('/adminDeleteComments', function (req, res, next) {
    
})
module.exports = router