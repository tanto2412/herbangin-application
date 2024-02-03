const express = require('express')
const session = require('express-session')
const passport = require('./middlewares/authMiddleware')

const apiRoutes = require('./routes/api')

require('dotenv').config() // Load environment variables from .env

const app = express()
const PORT = process.env.PORT || 3000 // Use the defined port or default to 3000

// Middleware
app.use(express.json()) // for parsing application/json
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
  })
)

// Initialize passport
app.use(passport.passport.initialize())
app.use(passport.passport.session())

// Import route modules
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
