const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const autorizacion = req.headers.authorization;
  if (autorizacion && autorizacion.startsWith("Bearer")) {
    const token = autorizacion.split(" ")[1];
    const payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    if (!payload.id) {
      return res.status(401).json({ error: "No autorizado." });
    } else {
      req.userId = payload.id;
      next();
    }
  } else {
    return res.status(401).json({ error: "No autorizado." });
  }
};
