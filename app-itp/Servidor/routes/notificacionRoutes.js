const express = require('express');
const router = express.Router();
const { agregarNotificacion, obtenerNotificaciones } = require('../controllers/notificacionController');

// Ruta para obtener las notificaciones de un usuario
router.get('/notificaciones/:id', obtenerNotificaciones);

// Ruta para agregar una nueva notificación
router.post('/notificaciones', agregarNotificacion);

module.exports = router;
