var express = require("express");
var router = express.Router();
var util = require("util");
var cloudinary = require("cloudinary").v2;
var uploader = util.promisify(cloudinary.uploader.upload);
var destroy = util.promisify(cloudinary.uploader.destroy);

// Modelos de la base de datos
var publicacionesModel = require("../../models/publicacionesModel");
var tagsModel = require("../../models/tagsModel");
var tag_publicacionModel = require("../../models/tag_publicacionModel");

// Middlewares
var tokenExtractor = require("../../middlewares/tokenExtractor");

/*
 * CRUD de publicaciones
 */

// Crear una publicación
router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    let data = req.body;
    if (
      data.id_usuario != "" &&
      data.id_categoria != "" &&
      data.titulo != "" &&
      data.contenido != ""
    ) {
      if (req.files && Object.keys(req.files).length > 0) {
        let imagen = (await uploader(req.files.imagen.tempFilePath)).public_id;
        data.imagen = imagen;
      }
      let publicacion = await publicacionesModel.createPublicacion(data);
      res.status(201).json(publicacion);
    } else {
      res.json({ error: "Faltan datos necesarios para la publicación." });
    }
  } catch (error) {
    console.log(error);
  }
});

// Traer todas las publicaciones
router.get("/", async (req, res, next) => {
  try {
    let publicaciones = await publicacionesModel.getPublicaciones();
    res.json(publicaciones);
  } catch (error) {
    console.log(error);
  }
});

// Traer todas las publicaciones de una categoria por id
router.get("/categorias/:id", async (req, res, next) => {
  try {
    let publicaciones = await publicacionesModel.getPublicacionesByid_categoria(
      req.params.id
    );
    publicaciones = publicaciones.map((publicacion) => {
      if (publicacion.imagen) {
        publicacion.imagen = cloudinary.url(publicacion.imagen);
      }
      return publicacion;
    });
    res.status(200).json(publicaciones);
  } catch (error) {
    console.log(error);
  }
});

// Crear todos los tags de una publicación por su id
router.post("/id/:id/tags", tokenExtractor, async (req, res, next) => {
  try {
    req.body.tags.forEach(async (tag) => {
      tag = tag.toLowerCase();
      tag = tag[0].toUpperCase() + tag.substring(1);
      let isExistedTag = await tagsModel.getTagsByNombre(tag);
      if (isExistedTag) {
        if (isExistedTag.id) {
          tag = isExistedTag.id;
        } else {
          tag = await tagsModel.createTag(tag);
          tag = tag.insertId;
        }
      } else {
        tag = await tagsModel.createTag(tag);
        tag = tag.insertId;
      }
      await tag_publicacionModel.createTag_publicacion(tag, req.params.id);
    });
    res.json({ success: "Tags creados" });
  } catch (error) {
    console.log(error);
    res.json({ error: "Error al crear los tags" });
  }
});

// Trae todos los tags de una publicación por su id
router.get("/id/:id/tags", async (req, res, next) => {
  try {
    let tags = await tag_publicacionModel.getTagsByPublicacion(req.params.id);
    res.json(tags);
  } catch (error) {
    console.log(error);
  }
});

// Elimina todos los tags de una publicación por su id
router.delete("/id/:id/tags", tokenExtractor, async (req, res, next) => {
  try {
    let tags = await tag_publicacionModel.deleteTag_publicacionByPublicacion(
      req.params.id
    );
    res.json(tags);
  } catch (error) {
    console.log(error);
  }
});

// Trae una publicación por su id
router.get("/id/:id", async (req, res, next) => {
  try {
    let publicacion = await publicacionesModel.getPublicacionById(
      req.params.id
    );
    if (publicacion.imagen) {
      publicacion.imagen = cloudinary.url(publicacion.imagen);
    }
    res.json(publicacion);
  } catch (error) {
    console.log(error);
  }
});

// Actualiza una publicación por su id
router.put("/id/:id", tokenExtractor, async (req, res, next) => {
  try {
    let publicacionOriginal = await publicacionesModel.getPublicacionesByid(
      req.params.id
    );
    let data = req.body;
    if (req.files && Object.keys(req.files).length > 0) {
      if (publicacionOriginal.imagen) {
        destroy(publicacionOriginal.imagen).then(() => {
          console.log("Imagen eliminada");
        });
      }
      let imagen = (await uploader(req.files.imagen.tempFilePath)).public_id;
      data.imagen = imagen;
    }
    let publicacion = await publicacionesModel.updatePublicacionById(
      data,
      req.params.id
    );
    console.log("Publicación modificada");
    res.json(publicacion);
  } catch (error) {
    console.log(error);
  }
});

// Actualiza los likes +1 en una publicación por su id
router.put("/id/:id/sumarlike", async (req, res, next) => {
  try {
    let result = await publicacionesModel.updatePublicacionSumarLikesById(
      req.params.id
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

// Elimina una publicación por su id
router.delete("/id/:id", tokenExtractor, async (req, res, next) => {
  try {
    let publicacion = await publicacionesModel.getPublicacionesByid(
      req.params.id
    );
    if (publicacion.imagen) {
      destroy(publicacion.imagen).then(() => {
        console.log("Imagen eliminada");
      });
    }
    await tag_publicacionModel.deleteTag_publicacionByPublicacion(
      req.params.id
    );
    let result = await publicacionesModel.deletePublicacionById(req.params.id);
    console.log("Publicación eliminada");
    res.status(204).json(result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
