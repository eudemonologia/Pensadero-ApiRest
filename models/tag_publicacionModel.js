var pool = require("./bd");

/**
 * Crea una nueva relación entre una publicación y un tag por sus ids.
 */
async function createTag_publicacion(id_tag, id_publicacion) {
  try {
    const result = await pool.query(
      "INSERT INTO tag_publicacion (id_tag, id_publicacion) VALUES (?, ?)",
      [id_tag, id_publicacion]
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae las publicaciones de un tag por su id.
 */
async function getPublicacionesByTag(id_tag) {
  try {
    const result = await pool.query(
      "SELECT * FROM tag_publicacion INNER JOIN publicaciones WHERE tag_publicacion.id_publicacion = publicaciones.id AND id_tag = ?",
      [id_tag]
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae todos los tags de una publicación por su id.
 */
async function getTagsByPublicacion(id_publicacion) {
  try {
    const result = await pool.query(
      "SELECT * FROM tag_publicacion INNER JOIN tags WHERE tag_publicacion.id_tag = tags.id AND id_publicacion = ?",
      [id_publicacion]
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae el número de publicaciones que tiene un tag.
 */
async function countPublicacionesByTag(id_tag) {
  try {
    const result = await pool.query(
      "SELECT COUNT(id) FROM tag_publicacion WHERE id_tag = ?",
      [id_tag]
    );
    return result[0]["COUNT(id)"];
  } catch (error) {
    console.log(error);
  }
}

/**
 * Elimina una relación entre una publicación y un tag por el id de la publicación.
 */
async function deleteTag_publicacionByPublicacion(id_publicacion) {
  try {
    const result = await pool.query(
      "DELETE FROM tag_publicacion WHERE id_publicacion = ?",
      [id_publicacion]
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Elimina una relación entre una publicación y un tag por el id del tag.
 */
async function deleteTag_publicacionByTag(id_tag) {
  try {
    const result = await pool.query(
      "DELETE FROM tag_publicacion WHERE id_tag = ?",
      [id_tag]
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createTag_publicacion,
  getPublicacionesByTag,
  getTagsByPublicacion,
  countPublicacionesByTag,
  deleteTag_publicacionByPublicacion,
  deleteTag_publicacionByTag,
};
