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

if(process.argv.length===2) {
    Person.find({})
    .then(
        result => {
            console.log("puhelinluettelo")
            result.forEach(person => {
                console.log(person.name, ' ', person.number)
            })
            mongoose.connection.close()
        }
    )
} else if(process.argv.length===4) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })
    console.log(person)
    person.save()
    .then(response => {
        console.log(`lisätään luetteloon henkilö ${person.name} numerolla ${person.number}`)
        mongoose.connection.close()
    })
} else {
    console.log("Pitäisi olla 2 argumenttia, oli :", process.argv.length-2)
}

/*for (let j = 0; j < process.argv.length; j++) {  
    console.log(j + ' -> ' + (process.argv[j]));
} */