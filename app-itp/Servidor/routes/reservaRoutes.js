const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Ruta para crear una nueva reserva
router.post('/reservas', reservaController.crearReserva);

// Ruta para cancelar una reserva
router.delete('/reservas/:id', reservaController.cancelarReserva);


// Ruta para obtener reservas por fecha
router.get('/reservas/:fecha', reservaController.obtenerReservasPorFecha);

// Ruta para obtener días completamente reservados
router.get('/dias-completamente-reservados',reservaController.obtenerDiasReservados);

module.exports = router;
