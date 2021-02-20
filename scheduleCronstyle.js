const schedule = require('node-schedule');
const dbBlog = require('./routes/dbBlog')
const dbComment = require('./routes/dbComment')

const scheduleCronstyle = () => {
    //每分钟的第30秒定时执行一次:
      schedule.scheduleJob('30 1 1 * * *',()=>{
        dbBlog.find({}, { _id: 1 }, function (err, data) {
            data.forEach(item => {
                dbComment.find({articleId: item._id}).countDocuments().exec(function (err, data) {
                    dbBlog.updateOne({_id: item._id}, {totalComments: data}, function(err, res) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log('update:', res);
                        }
                    });
                })
            })
        })
      }); 
  }
  
scheduleCronstyle();