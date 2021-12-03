var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");

// Modelos de la base de datos
var publicacionesModel = require("../../models/publicacionesModel");
var usuariosModel = require("../../models/usuariosModel");

// Middlewares
var tokenExtractor = require("../../middlewares/tokenExtractor");

/*
 * CRUD de usuarios
 */

// Traer todos los usuarios
router.get("/", async (req, res, next) => {
  try {
    let usuarios = await usuariosModel.getUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.log(error);
  }
});

// Traer el usuario por su id
router.get("/id/:id", async (req, res, next) => {
  try {
    let usuario = await usuariosModel.getUsuarioByid(req.params.id);
    res.status(200).json(usuario);
  } catch (error) {
    console.log(error);
  }
});

// Traer un usuario por su email
router.get("/email/:email", async (req, res, next) => {
  try {
    let usuario = await usuariosModel.getUsuarioByEmail(req.params.email);
    res.status(200).json(usuario);
  } catch (error) {
    console.log(error);
  }
});

// Traer publicaciones de un usuario por su id
router.get("/id/:id/publicaciones", async (req, res, next) => {
  try {
    let publicaciones = await publicacionesModel.getPublicacionesByUser(
      req.params.id
    );
    res.status(200).json(publicaciones);
  } catch (error) {
    console.log(error);
  }
});

/*
 * Acciones de los usuarios
 */

// Conectar usuario
router.post("/conectar", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let usuario = await usuariosModel.getUsuarioByEmailAndPassword(
      email,
      password
    );
    if (usuario) {
      const { password, ...userWithoutPassword } = usuario;
      const token = jwt.sign(
        userWithoutPassword,
        process.env.TOKEN_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      res.send({
        ...userWithoutPassword,
        token,
        expiresAt,
      });
    } else {
      res.status(401).json({ error: "Usuario o contraseña incorrectos." });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.log(error);
  }
});

// Checkear si un usuario está conectado por su id
router.get("/id/:id/isconnected", async (req, res, next) => {
  try {
    if (req.session.user && req.session.user.id == req.params.id) {
      console.log("Sesion está iniciada");
      res.json(true);
    } else {
      console.log("Sesion no está iniciada");
      res.json(false);
    }
  } catch (error) {
    console.log(error);
  }
});

// Desconectar usuario
router.post("/desconectar", tokenExtractor, async (req, res, next) => {
  try {
    console.log("Sesion cerrada");
    res.json(false);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
