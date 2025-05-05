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
const axios = require('axios');
const bodyParser = require("body-parser");
const LikedImageModel = require("./models/liked-image.model.js");

/* Middleware */
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/*Routes */
app.get('/', async function (req, res) {
    fetchNasaAPOD()
    res.setHeader('Content-Type', 'text/html')
    res.render('index', {
        data: {
            title: data.title,
            explanation: data.explanation,
            url: data.url,
            date: data.date
        }
    })
})
app.get('/pastImages', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.render('pastImages', { data: pastImageData })
})

app.post('/pastImage', (req, res) => {
    const pastDate = req.body.pastDate // Assuming the date is sent in the format 'YYYY-MM-DD'
    
    console.log('Received past date:', pastDate)
    const [year, month, day] = pastDate.split('-')

    fetchNasaPastImage(year, month, day)
    res.setHeader('Content-Type', 'text/html')
    res.render('pastImages', {
        data: {
            title: pastImageData.title,
            explanation: pastImageData.explanation,
            url: pastImageData.url,
            date: pastImageData.date,
        }
    })
})

app.get('/liked-images', async (req, res) => {
    const likedImages = await LikedImageModel.find({})
    console.log('Liked images:', likedImages)
    // This route can be used to display liked images if you implement a way to store them
    res.setHeader('Content-Type', 'text/html')
    res.render('liked-images', { likedImages: likedImages }) // Placeholder for liked images
})

app.post('/like-image', (req, res) => {
    // handle liking an image
    const likedImage = {
        title: req.body.title,
        explanation: req.body.explanation,
        url: req.body.url,
        date: req.body.date
    }

    const likedImageModel = new LikedImageModel({
        title: likedImage.title,
        explanation: likedImage.explanation,
        url: likedImage.url,
        date: new Date(likedImage.date) // Ensure date is stored as a Date object
    })


    // Here you would typically save the liked image to a database or session
    console.log('Liked image:', likedImage)
    likedImageModel.save()
        .then(() => {
            console.log('Liked image saved to database:', likedImage)
        })
        .catch((error) => {
            console.error('Error saving liked image to database:', error)
        })

    res.redirect('/liked-images') // Redirect to the liked images page
})

/* Functions */
let data = {}
function fetchNasaAPOD() {
    axios.get('https://api.nasa.gov/planetary/apod?api_key=JP819nqd29QxqT4SmnYcj357kGC6l5qE7uwp7U80')
        .then(response => {
            data = response.data
            console.log('NASA API response:', data)
        })
        .catch(error => {
            console.error('Error fetching data from NASA API:', error.message);
        })
}

let pastImageData = {}
function fetchNasaPastImage(year, month, day) {
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=JP819nqd29QxqT4SmnYcj357kGC6l5qE7uwp7U80&date=${year}-${month}-${day}`)
        .then(response => {
            pastImageData = response.data
            console.log('NASA Past Image API response:', pastImageData)
        })
        .catch(error => {
            console.error('Error fetching data from NASA Past Image API:', error.message);
        })
}

let likedImages = []

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
