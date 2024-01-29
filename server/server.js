const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
require('dotenv').config() // Load environment variables from .env

const app = express()
const PORT = process.env.PORT || 3000 // Use the defined port or default to 3000

// Middleware setup
app.use(bodyParser.json()) // Example JSON body parser middleware

// Routes setup
const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
