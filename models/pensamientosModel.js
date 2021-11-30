var pool = require("./bd");

/**
 * Crea un nuevo pensamiento.
 */
async function createPensamiento(data) {
  try {
    const result = await pool.query("INSERT INTO pensamientos SET ?", [data]);
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae todos los pensamientos.
 */
async function getPensamientos() {
  try {
    const pensamientos = await pool.query("SELECT * FROM pensamientos");
    return pensamientos;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae 10 pensamientos aleatorios.
 */
async function getPensamientosAleatorios() {
  try {
    const pensamientos = await pool.query(
      "SELECT * FROM pensamientos ORDER BY RAND() LIMIT 5"
    );
    return pensamientos;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Elimina un pensamiento por su id.
 */
async function deletePensamientoById(id) {
  try {
    const result = await pool.query("DELETE FROM pensamientos WHERE id = ?", [
      id,
    ]);
    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createPensamiento,
  getPensamientos,
  getPensamientosAleatorios,
  deletePensamientoById,
};
