var express = require("express");
var router = express.Router();

// Modelos de la base de datos
var tagsModel = require("../../models/tagsModel");
var tag_publicacionModel = require("../../models/tag_publicacionModel");

// Middlewares
var tokenExtractor = require("../../middlewares/tokenExtractor");

/* 
ROUTES DE LOS TAGS
*/

// Crea los tags en la base de datos
router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    let tags = req.body;
    let result = await tagsModel.createTags(tags);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

// Trae todos los tags
router.get("/", async (req, res, next) => {
  try {
    let tags = await tagsModel.getTags();
    res.json(tags);
  } catch (error) {
    console.log(error);
  }
});

// Trae un tag por su id
router.get("/id/:id", async (req, res, next) => {
  try {
    let tag = await tagsModel.getTagsByid(req.params.id);
    res.json(tag);
  } catch (error) {
    console.log(error);
  }
});

// Trae los tags de una publicacion por su id
router.get("/publicaciones/:id", async (req, res, next) => {
  try {
    let tags = await tagsModel.getTagsByPublicacion(req.params.id);
    res.json(tags);
  } catch (error) {
    console.log(error);
  }
});

// Trae el numero de publicaciones de un tag por su id
router.get("/id/:id/publicaciones/contar", async (req, res, next) => {
  try {
    let numero = await tag_publicacionModel.countPublicacionesByTag(
      req.params.id
    );
    res.json(numero);
  } catch (error) {
    console.log(error);
  }
});

// Eliminar un tag por su id
router.delete("/id/:id", tokenExtractor, async (req, res, next) => {
  try {
    await tag_publicacionModel.deleteTag_publicacionByTag(req.params.id);
    let tag = await tagsModel.deleteTagById(req.params.id);
    res.json(tag);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
