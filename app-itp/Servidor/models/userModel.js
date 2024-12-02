const db = require("../config/database"); // Importa la conexión a la base de datos
const Usuario = require('./usuarioModel'); // Importa el modelo de usuario

// Función para ver si existe un usuario en la base de datos
const getUserById = (identificacion, callback) => {
    db.query("SELECT * FROM users WHERE identificacion = ?", [identificacion], (err, results) => {
        if (err) return callback(err);
        
        if (results.length > 0) {
            const userData = results[0];
            const usuario = new Usuario(
                userData.ID,
                userData.IDENTIFICACION, 
                userData.NOMBRE, 
                userData.APELLIDO, 
                userData.CONTRASENA, 
                userData.ID_Rol);
            return callback(null, usuario); // Retorna la instancia del modelo
        } else {
            return callback(null, null); // Usuario no encontrado
        }
    });
};

module.exports = { getUserById };
