const Notificacion = require('../models/notificacionModel');

// Controlador para agregar una nueva notificación
exports.agregarNotificacion = (req, res) => {
    const { mensaje, id_usuario, fecha } = req.body;

    // Llama al modelo para agregar una nueva notificación
    Notificacion.agregarNotificacion(mensaje, id_usuario, fecha, (err, id_nueva_notificacion) => {
        if (err) {
            return res.status(500).json({ error: 'Error al agregar la notificación' });
        }
        res.status(201).json({ message: 'Notificación creada con éxito', id_notificacion: id_nueva_notificacion });
    });
};

// Controlador para obtener todas las notificaciones de un usuario
exports.obtenerNotificaciones = (req, res) => {
    const { id } = req.params;

    // Llama al modelo para obtener las notificaciones del usuario
    Notificacion.obtenerNotificaciones(id, (err, notificaciones) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener las notificaciones' });
        }
        res.status(200).json(notificaciones); // Devuelve las notificaciones al frontend
    });
};
