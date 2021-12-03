var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();

// archivos de las rutas
var indexRouter = require("./routes/index");
var usuariosRouter = require("./routes/api/usuarios");
var publicacionesRouter = require("./routes/api/publicaciones");
var categoriasRouter = require("./routes/api/categorias");
var tagsRouter = require("./routes/api/tags");
var pensamientosRouter = require("./routes/api/pensamientos");
var contactoRouter = require("./routes/api/contacto");

// Middlewares
var cors = require("cors");
var fileupload = require("express-fileupload");
var handleError = require("./middlewares/handleErrors");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configuracion de los middlewares
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(fileupload({ useTempFiles: true, tempFileDir: "/tmp/" }));

// rutas
app.use("/", indexRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/publicaciones", publicacionesRouter);
app.use("/api/categorias", categoriasRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/pensamientos", pensamientosRouter);
app.use("/api/contacto", contactoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(handleError);

module.exports = app;
