const authorizeUserOrAdmin = (req, res, next) => {
  const userIdFromToken = req.user.id;
  const userIdFromParams = req.params.id;

  if (req.user.is_admin || userIdFromToken === userIdFromParams) {
    return next();
  }

  return res.status(403).json({ message: "Unauthorized: ID mismatch" });
};

module.exports = { authorizeUserOrAdmin }