const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/myblogdb');
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     // we're connected!
//     let kittySchema = mongoose.Schema({
//         name: string
//     })
//     let Kitten = mongoose.model('Kitten', kittySchema)
//     let felyne = new Kitten({ name: 'Felyne' })
//     console.log(felyne.name)
//     let fluffy = new Kitten({ name: 'fluffy' })
//     fluffy.speak()
//     fluffy.save(function (err, flully) {
//         if (err) return console.log(err)
//         fluffy.speak();
//     })
//     Kitten.find(function (err, kittens) {
//         if (err) return console.error(err);
//         console.log(kittens);
//     })
//     Kitten.find({ name: /^fluff/ }, callback);
// })

db.once('open', function () {
    let UserSchema = mongoose.Schema({
        account: String,
        pass: String
    })

    let UserModel = mongoose.model('user', UserSchema)
    let userLogin = new UserModel({
        account: '20211425',
        pass: 'javascript'
    }) 
    userLogin.save(function (err, user) {
        if (err) return console.log(err)
        console.log(user)
    })
})