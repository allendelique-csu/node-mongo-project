/* This is a simple Express.js application that connects to a MongoDB database and fetches data from the NASA API.
   It uses EJS as the templating engine to render views. The application allows users to add tasks to a todo list and displays the list on the homepage.
*/

/* Imports */
const express = require("express")
const app = express()
const path = require("path")
const mongoose = require('mongoose');
const uri = "mongodb+srv://allendelique:Y8sQFYooNh4VqnZs@cluster0.78hmihb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const port = 3000
const todoModel = require('./models/todo.model.js')
const axios = require('axios');
const bodyParser = require("body-parser");

/* Middleware */
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/*Routes */
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.render('index', {
        nasaData: fetchNasaAPI()
    })
})
// app.get('/add', (req, res) => {
//     const todo = new todoModel({
//         taskName: req.body.newTask,
//         done: false
//     })
//     todo.save((err, todo) => {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log("Todo saved successfully")
//             res.redirect('/')
//         }
//     })
// })

/* Functions */
async function fetchNasaAPI() {
    const API_URL = 'https://api.nasa.gov/planetary/apod?api_key=JP819nqd29QxqT4SmnYcj357kGC6l5qE7uwp7U80'
    try {
        const response = await axios.get(API_URL)
        if (response.status !== 200) {
            throw new Error(`Error fetching data from NASA API: ${response.status}`);
        }
        // Check if the response data is empty
        if (!response.data) {
            throw new Error('No data received from NASA API');
        }
        // Check if the response data is in the expected format
        if (typeof response.data !== 'object' || !response.data.title || !response.data.explanation) {
            throw new Error('Unexpected data format from NASA API');
        }
        // Log the response data for debugging
        console.log('NASA API response:', response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching data from NASA API:', error.message);
    }
}

/* MongoDB & Server Connection */
mongoose.connect(uri, clientOptions)
    .then(() => {
        console.log("Connected to MongoDB")
        app.listen(port, () => {
            console.log(`Listening on port ${port}`)
        })
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err)
    })