var pool = require("./bd");

/**
 * Crea un nuevo tag.
 */
async function createTag(tag) {
  try {
    const result = await pool.query("INSERT INTO tags SET nombre = ?", [tag]);
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae todos los tags y el numero de publicaciones que tienen cada uno.
 */
async function getTags() {
  try {
    const result = await pool.query(
      "SELECT tags.*, COUNT(tag_publicacion.id_publicacion) AS num_publicaciones FROM tags LEFT JOIN tag_publicacion ON tags.id = tag_publicacion.id_tag GROUP BY id"
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae un tag por su id.
 */
async function getTagsByid(id) {
  try {
    const result = await pool.query("SELECT * FROM tags WHERE id = ?", [id]);
    return result[0];
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae un tag por su nombre.
 */
async function getTagsByNombre(nombre) {
  try {
    const result = await pool.query("SELECT * FROM tags WHERE nombre = ?", [
      nombre,
    ]);
    return result[0];
  } catch (error) {
    console.log(error);
  }
}

async function getTagsByPublicacion(id) {
  try {
    const result = await pool.query(
      "SELECT tags.* FROM tags LEFT JOIN tag_publicacion ON tags.id = tag_publicacion.id_tag WHERE tag_publicacion.id_publicacion = ?",
      [id]
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Eliminar un tag por su id.
 */
async function deleteTagById(id) {
  try {
    const result = await pool.query("DELETE FROM tags WHERE id = ?", [id]);
    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createTag,
  getTags,
  getTagsByid,
  getTagsByNombre,
  getTagsByPublicacion,
  deleteTagById,
};
