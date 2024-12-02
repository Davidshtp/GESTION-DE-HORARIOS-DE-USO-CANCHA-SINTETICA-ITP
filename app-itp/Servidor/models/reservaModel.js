const db = require("../config/database");

class Reserva {
    constructor(id_reserva, fecha_hora, persona_id) {
        this.id_reserva = id_reserva;
        this.fecha_hora = fecha_hora;
        this.persona_id = persona_id;
    }

    // Método para crear una nueva reserva
    static crearReserva(fecha_hora, persona_id,rol,callback) {
        
        const fecha = fecha_hora.split(' ')[0];// Obtener solo la fecha sin la hora

        // Contar las reservas del usuario para esa fecha
        this.contarReservasDelUsuarioPorFecha(persona_id, fecha,rol, (err, count) => {
            if (err) {
                return callback(err); // Maneja errores de la consulta
            }

            // Verifica si el usuario ya tiene una reserva para ese día
            if (count >= 1) {
                return callback(new Error("Ya tienes una reserva para este día."));
            }

            // Si no tiene reservas, crea la nueva reserva
            const query = "INSERT INTO reservas (Fecha_hora, Persona_id) VALUES (?, ?)";
            db.query(query, [fecha_hora, persona_id], (err, results) => {
                if (err) {
                    return callback(err); // Llama al callback con el error si ocurre
                }
                callback(null, results.insertId); // Devuelve el ID de la nueva reserva
            });
        });
    }


    // Método para cancelar una reserva
    static cancelarReserva(id_reserva, callback) {
        const query = "UPDATE reservas SET Estado = 'cancelado' WHERE ID_Reserva = ?";
        db.query(query, [id_reserva], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results.affectedRows);
        });
    }

   

    // Método para obtener reservas por fecha
    static obtenerReservasPorFecha(fecha, callback) {
    const query =`
    SELECT r.ID_Reserva, r.Fecha_hora, r.Persona_id, u.NOMBRE, u.APELLIDO, r.Estado
    FROM reservas r 
    JOIN users u ON r.Persona_id = u.ID 
    WHERE DATE(r.Fecha_hora) = ?`;
        db.query(query, [fecha], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results); 
        });
    }
   // Método para obtener días completamente reservados
    static obtenerDiasCompletamenteReservados(callback) {
        const query = `
        SELECT DATE(STR_TO_DATE(Fecha_hora, '%Y-%m-%d %H:%i:%s')) AS fecha, COUNT(*) AS count
        FROM reservas
        WHERE Estado = 'reservado'
        GROUP BY fecha
        HAVING COUNT(*) >= 17
        `;

        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
        
    }
    // Método para contar reservas del usuario en una fecha específica
    static contarReservasDelUsuarioPorFecha(persona_id, fecha,rol, callback) {

        if (rol === 'Administrador') {
            return callback(null, 0);
        }

        const query = `
            SELECT COUNT(*) AS count
            FROM reservas
            WHERE Persona_id = ? 
                AND DATE(Fecha_hora) = ?
                AND Estado = 'reservado'
        `;
        db.query(query, [persona_id, fecha], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0].count); // Devuelve la cantidad de reservas
        });
    }

    // Método para obtener una reserva por ID
    static obtenerReservaPorId(id_reserva, callback) {
        const query = "SELECT * FROM reservas WHERE ID_Reserva = ?";
        db.query(query, [id_reserva], (err, results) => {
            if (err) {
                return callback(err); // Maneja errores en la consulta
            }
            if (results.length === 0) {
                return callback(null, null); // Si no se encuentra la reserva, devuelve null
            }
            callback(null, results[0]); // Devuelve la primera reserva (solo debe haber una por ID)
        });
    }

   

}

module.exports = Reserva;
