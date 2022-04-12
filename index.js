const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token("post", (req, res) => JSON.stringify(req.body))
// Tiny ei enään käytössä, mutta oletan että 3.8 saa tehdä näin
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post"))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
    {
        id: 5,
        name: "test",
        number: "123"
    },
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get("/info", (req, res) => {
    console.log(Date.now())
    res.send(`Phonebook has info for ${persons.length} people <p> ${Date()} </p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const returnablePerson = persons.find(person => person.id === id)
    //console.log("palautus",returnablePerson)
    if (returnablePerson) {
        res.json(returnablePerson)
    }
    else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log(persons.filter(person => person.id))
    res.status(204).end()

})



app.post("/api/persons", (req, res) => {
    //console.log("body", req.body)

    if (!req.body["name"] || !req.body["number"]) {
        return res.status(400).json({
            error: "Name or number missing!"
        })
    }
    else if (persons.find(person => person.name === req.body["name"])) {
        return res.status(400).json({
            error: "Name must be unique!"
        })
    }


    const person = {
        id: Math.floor(Math.random() * 10000),
        name: req.body["name"],
        number: req.body["number"],
    }
    persons = [...persons, person]
    res.json(person)

})

const PORT = process.env.PORT ||3001
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/api/persons`)
})