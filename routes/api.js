var express = require("express");
var router = express.Router();
var util = require("util");
var cloudinary = require("cloudinary").v2;
var uploader = util.promisify(cloudinary.uploader.upload);
var destroy = util.promisify(cloudinary.uploader.destroy);
var nodemailer = require("nodemailer");

// Modelos de la base de datos
var publicacionesModel = require("../models/publicacionesModel");
var usuariosModel = require("../models/usuariosModel");
var categoriasModel = require("../models/categoriasModel");
var tagsModel = require("../models/tagsModel");
var tag_publicacionModel = require("../models/tag_publicacionModel");
var pensamientosModel = require("../models/pensamientosModel");

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
ROUTES DE LOS USUARIOS
*/

// Traer todos los usuarios
router.get("/usuarios", async (req, res, next) => {
  try {
    let usuarios = await usuariosModel.getUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.log(error);
  }
});

// Traer el usuario por su id
router.get("/usuarios/id/:id", async (req, res, next) => {
  try {
    let usuario = await usuariosModel.getUsuarioByid(req.params.id);
    res.json(usuario);
  } catch (error) {
    console.log(error);
  }
});

// Checkear si un usuario está conectado por su id
router.get("/usuarios/id/:id/isconnected", async (req, res, next) => {
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

// Traer un usuario por su email
router.get("/usuarios/email/:email", async (req, res, next) => {
  try {
    let usuario = await usuariosModel.getUsuarioByEmail(req.params.email);
    res.json(usuario);
  } catch (error) {
    console.log(error);
  }
});

// Conectar usuario
router.post("/usuarios/conectar", async (req, res, next) => {
  try {
    let usuario = await usuariosModel.getUsuarioByEmailAndPassword(
      req.body.email,
      req.body.password
    );
    if (usuario) {
      req.session.user = usuario;
      console.log("Sesion iniciada");
      res.json(usuario);
    } else {
      res.json({ error: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Desconectar usuario
router.get("/usuarios/desconectar", async (req, res, next) => {
  try {
    req.session.destroy();
    console.log("Sesion cerrada");
    res.json(false);
  } catch (error) {
    console.log(error);
  }
});

// Traer publicaciones de un usuario por su id
router.get("/usuarios/id/:id/publicaciones", async (req, res, next) => {
  try {
    let publicaciones = await publicacionesModel.getPublicacionesByUser(
      req.params.id
    );
    res.json(publicaciones);
  } catch (error) {
    console.log(error);
  }
});

/* 
ROUTES DE LAS PUBLICACIONES
*/

// Crear una publicación
router.post("/publicaciones/crear", secured, async (req, res, next) => {
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
      res.json(publicacion);
    } else {
      res.json({ error: "Faltan datos" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Traer todas las publicaciones de una categoria por id
router.get("/publicaciones/categorias/:id", async (req, res, next) => {
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
    res.json(publicaciones);
  } catch (error) {
    console.log(error);
  }
});

// Crear todos los tags de una publicación por su id
router.post("/publicaciones/id/:id/tags", secured, async (req, res, next) => {
  try {
    req.body.tags.forEach(async (tag) => {
      tag = tag.toLowerCase();
      tag = tag[0].toUpperCase() + tag.substring(1);
      console.log(tag);
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
router.get("/publicaciones/id/:id/tags", async (req, res, next) => {
  try {
    let tags = await tag_publicacionModel.getTagsByPublicacion(req.params.id);
    res.json(tags);
  } catch (error) {
    console.log(error);
  }
});

// Elimina todos los tags de una publicación por su id
router.delete("/publicaciones/id/:id/tags", secured, async (req, res, next) => {
  try {
    let tags = await tag_publicacionModel.deleteTag_publicacionByPublicacion(
      req.params.id
    );
    res.json(tags);
  } catch (error) {
    console.log(error);
  }
});

// Actualiza una publicación por su id
router.post(
  "/publicaciones/id/:id/modificar",
  secured,
  async (req, res, next) => {
    try {
      let publicacionOriginal = await publicacionesModel.getPublicacionesByid(
        req.params.id
      );
      let data = req.body;
      console.log(data);
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
  }
);

// Actualiza los likes +1 en una publicación por su id
router.get("/publicaciones/id/:id/sumarlikes", async (req, res, next) => {
  try {
    let result = await publicacionesModel.updatePublicacionLikesById(
      req.params.id
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

// Elimina una publicación por su id
router.get(
  "/publicaciones/id/:id/eliminar",
  secured,
  async (req, res, next) => {
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
      let result = await publicacionesModel.deletePublicacionById(
        req.params.id
      );
      console.log("Publicación eliminada");
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  }
);

/* 
ROUTES DE LAS CATEGORIAS
*/

// Trae todas las categorias
router.get("/categorias", async (req, res, next) => {
  try {
    let categorias = await categoriasModel.getCategorias();
    res.json(categorias);
  } catch (error) {
    console.log(error);
  }
});

/* 
ROUTES DE LOS TAGS
*/

// Crea los tags en la base de datos
router.post("/tags/crear", async (req, res, next) => {
  try {
    let tags = req.body;
    let result = await tagsModel.createTags(tags);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

// Trae todos los tags
router.get("/tags", async (req, res, next) => {
  try {
    let tags = await tagsModel.getTags();
    res.json(tags);
  } catch (error) {
    console.log(error);
  }
});

// Trae un tag por su id
router.get("/tags/id/:id", async (req, res, next) => {
  try {
    let tag = await tagsModel.getTagsByid(req.params.id);
    res.json(tag);
  } catch (error) {
    console.log(error);
  }
});

// Trae el numero de publicaciones de un tag por su id
router.get("/tags/id/:id/publicaciones/contar", async (req, res, next) => {
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
router.delete("/tags/id/:id", secured, async (req, res, next) => {
  try {
    await tag_publicacionModel.deleteTag_publicacionByTag(req.params.id);
    let tag = await tagsModel.deleteTagById(req.params.id);
    res.json(tag);
  } catch (error) {
    console.log(error);
  }
});

/* 
ROUTES DE LA RELACION DE TAGS Y PUBLICACIONES
*/

// Crea una relación entre los tags y una publicación
router.post("/tag_publicacion/crear", secured, async (req, res, next) => {
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

/* 
ROUTES DE CONTACTO
*/

// Envia un mensaje de contacto
router.post("/contacto", async (req, res, next) => {
  try {
    const mail = {
      from: req.body.email,
      to: "cristo.ottis@gmail.com",
      subject: "Mensaje de contacto de la web Pensadero",
      html: `Se contactó con el mail ${req.body.email} y dejo el siguiente mensaje: <br> ${req.body.mensaje}`,
    };

    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transport.sendMail(mail, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.json({ mensaje: "Mensaje enviado con exito." });
  } catch (error) {
    console.log(error);
  }
});

/* 
ROUTES DE LOS PENSAMIENTOS
*/

// Crea un pensamiento
router.post("/pensamientos/crear", secured, async (req, res, next) => {
  try {
    let pensamiento = req.body;
    let result = await pensamientosModel.createPensamiento(pensamiento);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

// Trae 5 pensamientos aleatorios
router.get("/pensamientos/aleatorios", async (req, res, next) => {
  try {
    let pensamientos = await pensamientosModel.getPensamientosAleatorios();
    res.json(pensamientos);
  } catch (error) {
    console.log(error);
  }
});

// Elimina un pensamiento por su id
router.delete("/pensamientos/id/:id", secured, async (req, res, next) => {
  try {
    let pensamiento = await pensamientosModel.deletePensamientoById(
      req.params.id
    );
    res.json(pensamiento);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
