// logger.js
const winston = require('winston')
const dotenv = require('dotenv')
dotenv.config()

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${level.toUpperCase()} ${timestamp}: ${message}`
})

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(winston.format.timestamp(), customFormat),
  transports: [
    new winston.transports.File({
      filename: process.env.ERROR_FILE,
      level: 'error',
    }),
  ],
})

module.exports = logger
