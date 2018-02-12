const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const fs = require('fs')

const password = fs.readFileSync('password.config').toString().replace('\n', '')
const username = fs.readFileSync('username.config').toString().replace('\n', '')

const url =
    "mongodb://".concat(username).concat(":").concat(password)
    .concat("@ds129428.mlab.com:29428/fs-3-db") 

mongoose.connect(url)

morgan.token('url', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan('tiny'))
/* app.use(cors) */
app.use(express.static('build'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const paivays = new Date()
    const hlomaara = persons.length
    res.send(`<div>
    <p>Puhelinluettelossa on ${hlomaara} henkilön tiedot</p>
    ${paivays}
    </div>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random()*(Math.pow(2,32)-1))
}

const onkoJoLuettelossa = (name) => {
    /* console.log(persons.find(person => person.name===name)) */
    return (persons.find(person => person.name===name)!==undefined)
}

app.post('/api/persons', (req, res) => {
    const body = req.body


    if(body.name===undefined) {
        return res.status(400).json({error: 'Name required'})
    }
    if(body.number===undefined) {
        return res.status(400).json({error: 'Number required'})
    }
    if(onkoJoLuettelossa(body.name)) {
        return res.status(400).json({error: 'Name must be unique'})
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)

    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})