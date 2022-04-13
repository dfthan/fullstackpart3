const mongoose = require("mongoose")

const url = process.env.MONGODB_URI
console.log(url)
mongoose.connect(url)
    .then(() => {
        console.log("Connected!")
    })
    .catch(error => {
        console.log("Failed to connect: ", error.message)
    })

    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    personSchema.set("toJSON", {
        transform: (document, returned) => {
            returned.id = returned._id.toString()
            delete returned._id
            delete returned.__v
        }
    })

    module.exports = mongoose.model("Person", personSchema)