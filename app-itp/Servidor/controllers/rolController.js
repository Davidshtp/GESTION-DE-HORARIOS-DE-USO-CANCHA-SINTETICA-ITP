const Rol = require('../models/rolModel');

const getRolById = (req, res) => {
    const { id_rol } = req.params;
    Rol.getRolById(id_rol, (err, rol) => {
        if (err) {
            console.error("Error al obtener el rol:", err);
            return res.status(500).json({ message: "Error al obtener el rol.", error: err.message });
        }
        if (rol) {
            res.json({ rol });
        } else {
            res.status(404).send('Rol no encontrado');
        }
    });
};

module.exports = {
    getRolById,
};
