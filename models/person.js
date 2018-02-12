const mongoose = require('mongoose')
const fs = require('fs')

const password = fs.readFileSync('password.config').toString().replace('\n', '')
const username = fs.readFileSync('username.config').toString().replace('\n', '')

const url =
    "mongodb://".concat(username).concat(":").concat(password)
    .concat("@ds129428.mlab.com:29428/fs-3-db") 

mongoose.connect(url)

const Person=mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person