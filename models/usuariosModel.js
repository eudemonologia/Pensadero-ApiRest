var pool = require("./bd");
var md5 = require("md5");

/**
 * Trae todos los usuarios.
 */
async function getUsuarios() {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae un usuario por su id.
 */
async function getUsuarioByid(id) {
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE id = ?", [
      id,
    ]);
    return result[0];
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae un usuario por su email.
 */
async function getUsuarioByEmail(email) {
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    return result[0];
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trae un usuario por su email y contraseña.
 */
async function getUsuarioByEmailAndPassword(email, password) {
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = ? AND password = ?",
      [email, md5(password)]
    );
    return result[0];
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getUsuarios,
  getUsuarioByid,
  getUsuarioByEmail,
  getUsuarioByEmailAndPassword,
};
