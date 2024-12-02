const Reserva = require('../models/reservaModel'); 
const Notificacion = require('../models/notificacionModel');
// Controlador para crear una reserva
exports.crearReserva = (req, res) => {
    const { Fecha_hora, Persona_id,rol } = req.body; 
   
    const fecha = Fecha_hora.split(' ')[0];

    // Llama al método para contar reservas solo si no es admin
    Reserva.contarReservasDelUsuarioPorFecha(Persona_id, fecha, rol, (err, count) => {
        if (err) {
            return res.status(500).json({ error: 'Error al contar las reservas' });
        }

        // Si el rol es usuario y ya tiene una reserva para ese día, devolver error
        if (rol === 'Usuario' && count >= 1) {
            return res.status(409).json({ error: 'Ya tienes una reserva para este día.' });
        }

        // Si no tiene reservas o es admin, proceder con la creación de la reserva
        Reserva.crearReserva(Fecha_hora, Persona_id,rol, (err, resultado) => {
            if (err) {
                return res.status(500).json({ error: 'Error al crear la reserva' });
            }

            // Crear una notificación para el usuario
            const mensaje = `Tu reserva ha sido realizada para el ${Fecha_hora}.`;
            Notificacion.agregarNotificacion(mensaje, Persona_id, Fecha_hora, (err, id_notificacion) => {
                if (err) {
                    console.error('Error al agregar notificación:', err);
                }
            });
            
            // Si la reserva se crea con éxito, devuelve el ID de la reserva creada
            res.status(201).json({ message: 'Reserva creada con éxito', id_reserva: resultado });
        });
    });
};

// Controlador para cancelar una reserva
exports.cancelarReserva = (req, res) => {
    const { id } = req.params; // Obtener el ID de la reserva desde los parámetros de la URL
    const { rol } = req.body;  // Obtener el rol del cuerpo de la solicitud

    // Primero, obtenemos la reserva para poder acceder a sus detalles
    Reserva.obtenerReservaPorId(id, (err, reserva) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la reserva' });
        }

        // Si no se encuentra la reserva, devuelve un error
        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        // Cancelar la reserva
        Reserva.cancelarReserva(id, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al cancelar la reserva' });
            }
            // Crear el mensaje de la notificación dependiendo del rol
            let mensaje;
            if (rol === 'Usuario') {
                mensaje = `Has cancelado tu reserva para el ${reserva.Fecha_hora} con éxito.`;
            }else{
                mensaje = `Tu reserva para el ${reserva.Fecha_hora} ha sido cancelada por un administrador.`;
            }


            // Crear una notificación para el usuario
            Notificacion.agregarNotificacion(mensaje, reserva.Persona_id, reserva.Fecha_hora, (err, id_notificacion) => {
                if (err) {
                    console.error('Error al agregar notificación:', err);
                }
            });

            res.status(200).json({ message: 'Reserva cancelada con éxito' });
        });
    });
};


// Controlador para obtener reservas por fecha
exports.obtenerReservasPorFecha = (req, res) => {
    const { fecha } = req.params;

      // Llama al modelo para obtener las reservas
      Reserva.obtenerReservasPorFecha(fecha, (err, reservas) => {
        if (err) {
            console.error("Error al obtener reservas:", err);
            // Asegúrate de que envías solo una respuesta
            return res.status(500).json({ mensaje: "Error al obtener las reservas" });
        }
        
        // Si no se encuentran reservas, envía una array vacio
        if (reservas.length === 0) {
            return res.status(200).json([]);
        }
        
        return res.status(200).json(reservas);
    });
};

// Controlador para obtener días completamente reservados
exports.obtenerDiasReservados = (req, res) => {
    Reserva.obtenerDiasCompletamenteReservados((err, results) => {
        if (err) {
            console.error('Error en el controlador:', err);
            return res.status(500).json({ error: 'Error al obtener los días reservados' });
        }
        //formateamos el resultado para que solo nos de fecha
        const formattedResults = results.map(item => {
            const fecha = item.fecha.toISOString().split('T')[0]; // Tomar solo la parte de la fecha
            return {
                fecha: fecha,
                count: item.count
            };
        });
        res.status(200).send(formattedResults);
        
    });
};









