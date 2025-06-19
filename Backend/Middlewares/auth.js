const auth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Unauthorized: No session" });
  }
  next();
};

module.exports = auth;
