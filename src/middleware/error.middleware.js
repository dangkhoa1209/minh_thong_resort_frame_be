function notFoundHandler(_req, res) {
  return res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
}

function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (res.headersSent) {
    return;
  }

  return res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: error.message || "Internal error" },
  });
}

module.exports = { notFoundHandler, errorHandler };
