var express = require("express");
var router = express.Router();

// Modelos de la base de datos
var pensamientosModel = require("../../models/pensamientosModel");

// Middlewares
var tokenExtractor = require("../../middlewares/tokenExtractor");

/* 
ROUTES DE LOS PENSAMIENTOS
*/

// Crea un pensamiento
router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const pensamiento = req.body;
    let result = await pensamientosModel.createPensamiento(pensamiento);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
});

// Trae todos los pensamientos
router.get("/", async (req, res, next) => {
  try {
    let result = await pensamientosModel.getPensamientos();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

// Trae 5 pensamientos aleatorios
router.get("/aleatorios", async (req, res, next) => {
  try {
    let pensamientos = await pensamientosModel.getPensamientosAleatorios();
    res.status(200).json(pensamientos);
  } catch (error) {
    console.log(error);
  }
});

// Elimina un pensamiento por su id
router.delete("/id/:id", tokenExtractor, async (req, res, next) => {
  try {
    let pensamiento = await pensamientosModel.deletePensamientoById(
      req.params.id
    );
    res.status(204).json(pensamiento);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
