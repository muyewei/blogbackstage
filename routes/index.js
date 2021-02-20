const dbBlog = require('./dbBlog')
const express = require('express')
const router = express.Router()
const basic = require('../basic')
const dbComment = require('./dbComment')

router.get('/getArticleList', function (req, res) {
    var pageLimit = req.query
    var pageData = { 'totalNum': 1, 'articles': [] }
    var type = {}
    if (req.query.type) {
        type.tags =  {$regex: req.query.type}
    }
    // console.log('articletype: ', type)
    // console.log(req.query)
    new Promise((resolve, reject) => {
        dbBlog.find(type).countDocuments().exec(function (err, data) {
            if (err) {
                console.log('getPageLimitErr: ', err)
                reject()
            }
            pageData.totalNum = data
            // console.log(data)
            resolve()
        })
    }).then(() => {
        return new Promise((resolve, reject) => {
            dbBlog.find(type).skip((pageLimit.page - 1) * parseInt(pageLimit.limit)).limit(parseInt(pageLimit.limit)).exec(function (err, data) {
                if (err) {
                    console.log('getPageLimit: ', err)
                    reject()
                }
                pageData.articles = data
                resolve()
            })
        })
    }).then(() => {
        res.send(pageData)
    })
})

router.get('/getMyArticle', function (req, res) {
    // console.log(req.query)
    // console.log(req.query.articleId)
    dbBlog.find({ '_id': req.query.articleId }, function (err, data) {
        if (err) {
            console.log('getMyArticleErr: ', err)
            reject()
        }
        res.send(data)
    })
})

router.get('/getCommentList', function (req, res) {
    dbComment.find({"articleId": req.query.articleId},function (err,data) {
        if (err) {
            console.log('getMyArticleErr: ', err)
            reject()
        }
        res.send(data)
    })
})

router.get('/uploadComment', function (req, res) {
    var commentdetail = JSON.parse(req.query.commentdetail)
    var commentSplit = commentdetail.comment.toString().split('</blockquote>')
    for (let i = 0; i < commentSplit.length - 1; i++){
        commentSplit[i] += '</blockquote>'
    }
    var n = new Date()
    commentdetail.articleId = req.query.articleId
    commentdetail.img = basic.url + 'static/images/face.jpg'
    commentdetail.cdate = n.getFullYear() + '/' + (n.getMonth() + 1) + '/' + n.getDate()
    commentdetail.quote = commentSplit.length > 1 ? commentdetail.comment.toString().slice(0,(commentSplit[ commentSplit.length-1 ].length) * -1) : ""
    commentdetail.comment = commentSplit.length > 1 ? commentSplit[ commentSplit.length - 1 ] : commentdetail.comment
    console.log('quotrL: ', commentdetail.quote)
    console.log('cimerie: ', commentdetail.comment)
    // return
    var comment = new dbComment(commentdetail)
    comment.save(function (err, data) {
        if (err) return console.log(err)
        res.send('留言成功')
    })
})

router.get('/getLatestComment', function (req, res) {
    // 给每一遍博客 统计总评论数
    // dbBlog.find({}, { _id: 1 }, function (err, data) {
    //     data.forEach(item => {
    //         dbComment.find({articleId: item._id}).countDocuments().exec(function (err, data) {
    //             dbBlog.updateOne({_id: item._id}, {totalComments: data}, function(err, res) {
    //                 if (err) {
    //                   console.log(err);
    //                 } else {
    //                   console.log('update:', res);
    //                 }
    //             });
    //         })  
    //     })
    // })
    dbComment.find({}, {  user: 1, articleId: 1, _id:0 },{limit: 4},function (err,data) {
        if (err) {
            console.log('getMyArticleErr: ', err)
        }
        res.send(data)
    })
})

module.exports = router