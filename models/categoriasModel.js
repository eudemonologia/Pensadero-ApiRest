var pool = require("./bd");

/**
 * Trae todas las categorias.
 */
async function getCategorias() {
  try {
    var categorias = await pool.query("SELECT * FROM categorias");
    return categorias;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae una categoria por su nombre.
 */
async function getCategoriasByNombre(nombre) {
  try {
    const result = await pool.query(
      "SELECT * FROM categorias WHERE nombre = ?",
      [nombre]
    );
    return result[0];
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae una categoria por su id.
 */
async function getCategoriasByid(id) {
  try {
    const result = await pool.query("SELECT * FROM categorias WHERE id = ?", [
      id,
    ]);
    return result[0];
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getCategorias,
  getCategoriasByNombre,
  getCategoriasByid,
};
