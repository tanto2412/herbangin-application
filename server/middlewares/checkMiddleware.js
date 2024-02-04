// checkMiddleware

function checkMissingParams(requiredParams) {
  return (req, res, next) => {
    const missingParams = []

    // Check each required parameter
    requiredParams.forEach((param) => {
      if (req.body[param] === undefined || req.body[param] === null) {
        missingParams.push(param)
      }
    })

    // If there are missing parameters, respond with an error
    if (missingParams.length > 0) {
      return res.status(400).json({
        error: `Missing required parameters: ${missingParams.join(', ')}`,
      })
    }

    // All required parameters are present, continue to the next middleware
    next()
  }
}

module.exports = {
  checkMissingParams,
}
