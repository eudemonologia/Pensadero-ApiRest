var express = require("express");
var router = express.Router();

// Modelos de la base de datos
var categoriasModel = require("../../models/categoriasModel");

/*
 * CRUD de categorias
 */

// Trae todas las categorias
router.get("/", async (req, res, next) => {
  try {
    let categorias = await categoriasModel.getCategorias();
    res.json(categorias);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
