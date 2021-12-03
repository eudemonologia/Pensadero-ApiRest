const ERROR_HANDLER = {
  CastError: (err, res) => {
    res.status(400).json({
      error: "El id no es valido",
    });
  },
  ValidationError: (err, res) => {
    res.status(409).json({
      error: err.message,
    });
  },
  JsonWebTokenError: (err, res) => {
    res.status(401).json({
      error: "Token invalido",
    });
  },
  TokenExpirerError: (err, res) => {
    res.status(401).json({
      error: "Token expirado",
    });
  },
  DefaultError: (err, res) => {
    res.status(500).json({
      error: err.message,
    });
  },
};

module.exports = (err, req, res, next) => {
  console.error(err.name);
  const { name } = err;
  const handler = ERROR_HANDLER[name] || ERROR_HANDLER.DefaultError;
  handler(err, res);
};
