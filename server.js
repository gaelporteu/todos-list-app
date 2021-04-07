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
// this connects the database and useUnifiedTopology removes deprecated connection options to remove some error messages
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    // then will connect to the db
    .then(client => {
        // clg to let us know if connected to which db
        console.log(`You're Connected ${dbName} database`)
        // this is the db we are connecting to
        db = client.db(dbName)
    })
    // in case of error this is what we will see in the clg
    .catch(err => {
        console.log(err)
    })
// this allows us to use the ejs framework    
app.set('view engine', 'ejs') // middleware
// this is what allows express to view all files in the 'public' folder
app.use(express.static('public')) // middleware
// this is the express.js body-parsing middleware it gives you "req.body" -> not sure how to use this
app.use(express.urlencoded({ extended: true })) // middleware
// middleware in express parses incoming requests with JSON payloads and is based on body-parser -> not sure what all this means
app.use(express.json()) // middleware

app.get("/", async (req, res) => {
    try {
      const todoItems = await db.collection("todos").find().toArray();
      const itemsLeft = await db
        .collection("todos")
        .countDocuments({ completed: false });
      res.render("index.ejs", { zebra: todoItems, left: itemsLeft });
    } catch (err) {
      console.error(err);
      res.send('Sorry, there was an error');
    }
  });

// express routing is how a server responds to clients requests
// app.get('/', async (req, res) => {
//     // this will put the todos in the db into an array
//     const todoItems = await db.collection('todos').find().toArray()
//     // this adds counts how many 'completed: false' items are in the database
//     const itemsLeft = await db.collection('todos').countDocuments(
//     {completed: false})
//     // tell put how many 'completed: false' items there are in the db into index.ejs file and render it to the browser
//     res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
    
//     // deprecated code used async await instead
//     // db.collection('todos').find().toArray()
//     // .then(data => {
//     //     db.collection('todos').countDocuments({completed: false})
//     //     .then(itemsLeft => {
//     //         res.render('index.js', {zebra: data, left: itemsLeft})
//     //     })
//     // })
// })

// this creates an item and puts it into the db
app.post('/createTodo', (req, res) => {
    // console.log(todo: req.body) // this will give us what is sent to the db
    // this inserts the default content submitted in the client to the db collection
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false })
    // this will then do something
    .then(result => {
        // this gets printed to the console
        console.log(`Todo has been added`)
        // this will reload the client page and show what is newly on the db
        res.redirect('/')
    })
})
// this is what will listen for marking a task complete
app.put('/markComplete', (req, res) => {
    // this is where in the db the mark complete is registered
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        // this is how it is done in the db with MongoDB
        $set: {
            // this tells the main.js file to mark it complete
            completed: true
        }
    })
    // then this is what is done after the db has been changed
    .then(result => {
        // this is printed to the console
        console.log('Marked Complete')
        // not sure what this is for?
        res.json('Marked Complete')
    })
})
// Not sure I understand this one?
app.put('/markUnComplete', (req, res) => {
    // this takes the body parser info 'req.body.rainbowUnicorn' and sets that document in the db to 'complete: true'
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        // MongoDB Atlas access the the db point for this document
        $set: {
            // sets completed to true which will put a line through on client side
            completed: true
        }
    })
    // this happens after the db is altered
    .then(result => {
        // print to console "Marked complete"
        console.log('Marked Complete')
        // do not understand this part
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