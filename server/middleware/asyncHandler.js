
// Wraps async route handlers so thrown errors go to Express (no more crashes)
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
