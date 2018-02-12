const mongoose = require('mongoose')
/*
const fs = require('fs')

const password = fs.readFileSync('password.config').toString().replace('\n', '')
const username = fs.readFileSync('username.config').toString().replace('\n', '')

const url =
    "mongodb://".concat(username).concat(":").concat(password)
    .concat("@ds129428.mlab.com:29428/fs-3-db") */


if (process.env.NODE_ENV !== 'production') {
    console.log('Not production')
    require('dotenv').config()
} else {
    console.log('Production')
}

const url = process.env.MONGODB_URI
mongoose.connect(url)

const Schema = mongoose.Schema

const personSchema = new Schema({
    name: String,
    number: String
})

personSchema.statics.format = function (person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}


const Person = mongoose.model('Person', personSchema)



module.exports = Person