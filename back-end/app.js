require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})
app.get('/about', (req, res) => {
  // JSON object containing personal information
  const aboutUsData = {
    name: 'Nathan Daniel', 
    description: 'Hello, my name is Nathan and I am in my final year at New York University. I am from New Jersey, where I grew up in West Orange. I am currently studying Computer Science at CAS. I am also currently looking for intern positions where I can develop skills in programming. I have many hobbies, like playing the piano and the guitar. I also spend my free time playing volleyball and going to the gym. My Github username is WayyGood. I love video games, particularly Minecraft and Valorant. My favorite genre of music is RnB. Thank you for reading!',
    image: 'https://media.licdn.com/dms/image/v2/C5603AQG0eRqZLm0Lew/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1654113883889?e=1732752000&v=beta&t=28XxkkZ_i-Lw36eqwfb26MLkvGPTSB8VIqeNvQo1g8g', // Replace with the actual URL of the photo
  };

  // Send the JSON response
  res.json(aboutUsData);
});
// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
