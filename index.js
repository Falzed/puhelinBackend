const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('url', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan('tiny'))
/* app.use(cors) */
app.use(express.static('build'))

/*let persons = [
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
] */

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

app.get('/api/persons', (req, res) => {
    Person.find({})    
    .then(result => {
        res.json(result.map(Person.format))
    })
    .catch(error => {
        console.log(error)
        res.status(404).end()
    })  
})

app.get('/info', (req, res) => {
    const paivays = new Date()
    Person.find({})    
    .then(result => {
        res.send(`<div>
        <p>Puhelinluettelossa on ${result.length} henkilön tiedot</p>
        ${paivays}
        </div>`)
    }).catch(error => {
        console.log(error)
        res.status(404).end()
    })
})

app.get('/api/persons/:id', (req, res) => {

    Person
        .findById(req.params.id)
        .then(person => {
            if(person) {
                res.json(Person.format(person))
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (req, res) => {

    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => {
        console.log(error)
        res.status(400).end()
    }) 
})

const generateId = () => {
    return Math.floor(Math.random()*(Math.pow(2,32)-1))
}

 const onkoJoLuettelossa = (name) => {
    Person.find(person=> {
        person.name===name
    })  
    .then(result => {
        console.log(result)
        console.log(result !== undefined)
        return result !== undefined
    })
    .catch(error => {
        console.log(error)
    })  
} 

app.post('/api/persons', (req, res) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    if(body.name===undefined) {
        return res.status(400).json({error: 'Name required'})
    }
    if(body.number===undefined) {
        return res.status(400).json({error: 'Number required'})
    }
    if(onkoJoLuettelossa(body.name)) {
        Person.findOneAndUpdate({name: body.name}, person,
             {number: person.number})
    } else {
        person.save()
        .then(result => {
            console.log(`lisätään luetteloon henkilö ${person.name} numerolla ${person.number}`)
        })
        .catch(error => {
            console.log(error)
        })

        res.json(person)
    }       
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})