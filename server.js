// Activate the express.js framework
const express = require('express')
// Place express.js in a variable called app
const app = express()
// Put the MongoDB db connection into a variable called MongoClient
const MongoClient = require('mongodb').MongoClient
// Your localhost access to this app is on port 2121
const PORT = 2121
// Activate the dotenv framework to store info securely
require('dotenv').config()
// Your database variable for all references
let db,
// this is where we place your connection string to MongoDB Atlas it is stored in the dotenv file for more security
    dbConnectionStr = process.env.DB_STRING,
    // Your database name is
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`You're Connected ${dbName} database`)
        db = client.db(dbName)
    })

    .catch(err => {
        console.log(err)
    })
    
app.set('view engine', 'ejs') // middleware
app.use(express.static('public')) // middleware
app.use(express.urlencoded({ extended: true })) // middleware
app.use(express.json()) // middleware

app.get('/', async (req, res) => {
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments(
    {completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
    
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         res.render('index.js', {zebra: data, left: itemsLeft})
    //     })
    // })
})

app.post('/createTodo', (req, res) => {
    // console.log(todo: req.body) // this will give us what is sent to the db
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false })
    .then(result => {
        console.log(`Todo has been added`)
        res.redirect('/')
    })
})

app.put('/markComplete', (req, res) => {
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        $set: {
            completed: true
        }
    })
    .then(result => {
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.put('/markUnComplete', (req, res) => {
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        $set: {
            completed: true
        }
    })
    .then(result => {
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.put('/undo', (req, res) => {
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        $set: {
            completed: false
        }
    })
    .then(result => {
        console.log('Marked Not Complete')
        res.json('Marked Not Complete')
    })
})

app.delete('/deleteTodo', (req, res) => {
    db.collection('todos').deleteOne({todo: req.body.rainbowUnicorn})
    .then(result => {
        console.log('deleted todo')
        res.json('Deleted it')
    })
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`server is running`);
})