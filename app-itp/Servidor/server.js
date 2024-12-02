const express = require("express");
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const rolRoutes = require('./routes/rolRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', userRoutes);
app.use('/api', rolRoutes);
app.use('/api', reservaRoutes);
app.use('/api', notificacionRoutes);

// Se corre el backend en el puerto 3001
app.listen(3001, () => {
    console.log("corriendo en el puerto 3001");
});
