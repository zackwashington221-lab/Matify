export function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const status = err.status || (err.name === "ValidationError" ? 422 : 500);
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: err.message || "Internal server error",
    ...(err.errors ? { details: err.errors } : {}),
  });
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
