var express = require("express");
var router = express.Router();

// Modelos de la base de datos
var tagsModel = require("../../models/tagsModel");
var tag_publicacionModel = require("../../models/tag_publicacionModel");

// Midleware para comprobar si el usuario esta logueado
secured = async (req, res, next) => {
  try {
    if (req.session.user) {
      next();
    } else {
      console.log("No esta logueado");
      res.json({ error: "No se encuentra iniciada la sesión." });
    }
  } catch (error) {
    console.log(error);
  }
};

/* 
ROUTES DE LA RELACION DE TAGS Y PUBLICACIONES
*/

// Crea una relación entre los tags y una publicación
router.post("/tag_publicacion/crear", async (req, res, next) => {
  try {
    req.body.forEach(async (element) => {
      let id_tag = await tagsModel
        .getTagsByNombre(element.tag)
        .then((tag) => {
          return tag.id;
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(id_tag);
      if (id_tag == undefined) {
        console.log("Creando tag...");
        id_tag = await tagsModel
          .createTag({
            nombre: element.tag,
          })
          .then((tag) => {
            console.log("El tag creado es: " + tag.insertId);
            return tag.insertId;
          })
          .catch((error) => {
            console.log(error);
          });
      }
      let id_publicacion = element.publicacion;
      let result = await tag_publicacionModel.createTag_publicacion(
        id_tag,
        id_publicacion
      );
      res.json({ mensaje: "Relación creada con exito." });
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
