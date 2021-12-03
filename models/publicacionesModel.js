var pool = require("./bd");

/**
 * Crea una nueva publicación.
 */
async function createPublicacion(data) {
  try {
    const result = await pool.query("INSERT INTO publicaciones SET ?", [data]);
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae todas las publicaciones.
 */
async function getPublicaciones() {
  try {
    const result = await pool.query(
      "SELECT publicaciones.*, usuarios.nombre AS autor_nombre, usuarios.apellido AS autor_apellido FROM publicaciones JOIN usuarios ON publicaciones.id_usuario = usuarios.id ORDER BY fecha_creacion DESC"
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae una publicación por su id.
 */
async function getPublicacionesByid(id) {
  try {
    const result = await pool.query(
      "SELECT * FROM publicaciones WHERE id = ?",
      [id]
    );
    return result[0];
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae todas las publicaciones de un usuario por su id.
 */
async function getPublicacionesByid_usuario(id_usuario) {
  try {
    const result = await pool.query(
      "SELECT * FROM publicaciones WHERE id_usuario = ? ORDER BY fecha_creacion DESC",
      [id_usuario]
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae todas las publicaciones de una categoría por su id.
 */
async function getPublicacionesByid_categoria(id_categoria) {
  try {
    const result = await pool.query(
      "SELECT publicaciones.*, usuarios.nombre AS autor_nombre, usuarios.apellido AS autor_apellido, GROUP_CONCAT(tags.nombre) AS tags_publicacion FROM publicaciones JOIN usuarios ON publicaciones.id_usuario = usuarios.id LEFT JOIN tag_publicacion ON tag_publicacion.id_publicacion = publicaciones.id LEFT JOIN tags ON tag_publicacion.id_tag = tags.id WHERE publicaciones.id_categoria = ? GROUP BY publicaciones.id ORDER BY fecha_creacion DESC",
      [id_categoria]
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Actualiza una publicación por su id.
 */
async function updatePublicacionById(data, id) {
  try {
    const result = await pool.query("UPDATE publicaciones SET ? WHERE id = ?", [
      data,
      id,
    ]);
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Actualiza los likes +1 en una publicación por su id
 */
async function updatePublicacionSumarLikesById(id) {
  try {
    await pool.query("UPDATE publicaciones SET likes = likes+1 WHERE id = ?", [
      id,
    ]);
    const result = await pool.query(
      "SELECT likes FROM publicaciones WHERE id = ?",
      [id]
    );
    return result[0];
  } catch (error) {
    console.log(error);
  }
}

/**
 * Elimina una publicación por su id.
 */
async function deletePublicacionById(id) {
  try {
    const result = await pool.query("DELETE FROM publicaciones WHERE id = ?", [
      id,
    ]);
    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createPublicacion,
  getPublicaciones,
  getPublicacionesByid,
  getPublicacionesByid_usuario,
  getPublicacionesByid_categoria,
  updatePublicacionById,
  updatePublicacionSumarLikesById,
  deletePublicacionById,
};
