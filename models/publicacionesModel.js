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
      "SELECT * FROM publicaciones WHERE id_categoria = ? ORDER BY fecha_creacion DESC",
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
async function updatePublicacionLikesById(id) {
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
  getPublicacionesByid,
  getPublicacionesByid_usuario,
  getPublicacionesByid_categoria,
  updatePublicacionById,
  updatePublicacionLikesById,
  deletePublicacionById,
};
