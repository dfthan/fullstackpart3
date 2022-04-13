const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
require("dotenv").config()
const app = express()
const Person = require("./models/person")
const { response } = require('express')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token("post", (req, res) => JSON.stringify(req.body))
// Tiny ei enään käytössä, mutta oletan että tehtävässä 3.8 saa tehdä näin
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post"))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get("/info", (req, res) => {
    console.log(Date.now())
    res.send(`Phonebook has info for ${persons.length} people <p> ${Date()} </p>`)
})

app.get('/api/persons', (req, res) => {
    Person.find()
        .then(persons => {
            res.json(persons)
        })
})

app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            res.json(person)
        })

})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id) 
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))

})

app.post("/api/persons", (req, res) => {
    //console.log("body", req.body)

    if (!req.body["name"] || !req.body["number"]) {
        return res.status(400).json({
            error: "Name or number missing!"
        })
    }
    /*
    else if (persons.find(person => person.name === req.body["name"])) {
        return res.status(400).json({
            error: "Name must be unique!"
        })
    }
    */

    const person = new Person({
        name: req.body["name"],
        number: req.body["number"],
    })

    person.save()
        .then(saved => {
            res.json(saved)
        })

})

app.put("/api/persons/:id", (req,res,next) => {
    const person = {
        name: req.body["name"],
        number: req.body["number"],
    }

    Person.findByIdAndUpdate(req.params.id,person, {new:true})
        .then(updated => {
            res.json(updated)
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(PORT)
    console.log(`Server running on http://localhost:${PORT}/api/persons`)
})