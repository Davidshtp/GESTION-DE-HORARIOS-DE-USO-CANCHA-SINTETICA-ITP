const db=require ("../config/database")
class Rol {
    constructor(id_rol, rol) {
        this.id_rol = id_rol;
        this.rol = rol;
    }

    // Método para obtener el rol del usuario desde la base de datos
    static getRolById(id_rol, callback) {
        const query = "SELECT rol FROM roles WHERE ID_Rol = ?"; 
        db.query(query, [id_rol], (err, results) => {
            if (err) {
                return callback(err); // Llama al callback con el error si ocurre
            }
            if (results.length > 0) {
                callback(null, results[0].rol); // Devuelve el rol
            } else {
                callback(null, null); // Rol no encontrado
            }
        });
    }
}

module.exports = Rol;