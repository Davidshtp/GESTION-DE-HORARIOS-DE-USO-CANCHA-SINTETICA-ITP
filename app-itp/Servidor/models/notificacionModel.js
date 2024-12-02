const db = require('../config/database'); // Importa la conexión de la base de datos

class Notificacion {
    constructor(id, mensaje, id_usuario, fecha) {
        this.id = id;
        this.mensaje = mensaje;
        this.id_usuario = id_usuario;
        this.fecha = fecha
    }

    // Método para agregar una nueva notificación
    static agregarNotificacion(mensaje, id_usuario, fecha, callback) {
        const query = "INSERT INTO notificaciones (mensaje, id_usuario, fecha) VALUES (?, ?, ?)";
        db.query(query, [mensaje, id_usuario, fecha], (err, results) => {
            if (err) {
                return callback(err); // Maneja el error de la consulta
            }
            callback(null, results.insertId); // Devuelve el ID de la nueva notificación
        });
    }

    // Método para obtener las notificaciones de un usuario
    static obtenerNotificaciones(id_usuario, callback) {
        const query = "SELECT * FROM notificaciones WHERE id_usuario = ? ORDER BY Id DESC";
        db.query(query, [id_usuario], (err, results) => {
            if (err) {
                return callback(err); // Maneja el error de la consulta
            }
            callback(null, results); // Devuelve las notificaciones
        });
    }
}

module.exports = Notificacion;
