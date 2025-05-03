const auth = (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Check token logic here...
    next();
  };
  
  module.exports = auth;
  