const isServerError = (statusCode) => {
  return statusCode >= 500 && statusCode < 600
}

const isClientError = (statusCode) => {
  return statusCode >= 400 && statusCode < 500
}

const ServerError = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  console.error("ERROR STACK:", err.stack)
  console.error("ERROR MESSAGE:", err.message)

  const statusCode = err.statusCode || 500
  let errorType = "Error"
  let errorMessage = err.message || "An unexpected error occurred."

  if (isServerError(statusCode)) {
    errorType = "ServerError"
    if (statusCode === 500 && !err.message) {
      errorMessage = "Internal Server Error. Please try again later."
    }
  } else if (isClientError(statusCode)) {
    errorType = "ClientError"
  }
  res.status(statusCode).json({
    status: "error",
    error: {
      name: err.name || errorType,
      message: errorMessage,
      statusCode: statusCode,
    },
  })
}

const NotFoundError = (req, res, next) => {
  res.status(404).json({
    status: "error",
    error: {
      name: "NotFoundError",
      message: `The requested URL ${req.originalUrl} was not found on this server.`,
      statusCode: 404,
    },
  })
}

module.exports = { NotFoundError, ServerError }
