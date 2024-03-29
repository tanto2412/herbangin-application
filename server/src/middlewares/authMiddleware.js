// authMiddleware.js
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.nama)
})

// Deserialize user from session
passport.deserializeUser((username, done) => {
  const user = userModel.getByUsername(username)
  delete user.password
  done(null, user)
})

// Local strategy for username/password authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userModel.getByUsername(username)

      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (passwordMatch) {
          delete user.password
          return done(null, user)
        }
      }

      return done(null, false, 'incorrect username or password.')
    } catch (error) {
      return done(null, false, 'incorrect username or password.')
    }
  })
)

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.status(401).send('please login first')
}

async function isAdministrator(req, res, next) {
  const user = await req.user
  if (user.administrator) {
    return next()
  }

  res.status(401).send('only supervisor can access')
}

module.exports = {
  passport,
  isAuthenticated,
  isAdministrator,
}
