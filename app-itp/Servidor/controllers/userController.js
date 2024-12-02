// controllers/userController.js
const UserModel = require('../models/userModel'); // Importamos el modelo de usuario

const loginUser = (req, res) => {
    const { identificacion, contrasena } = req.body;
    //verificar que sea un numero el id
    if (isNaN(identificacion)) {
        return res.status(400).json({ message: "El ID debe ser un número" });
    }

    // Buscar usuario por identificación
    UserModel.getUserById(identificacion, async (err, usuario) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error en el servidor");
        }

        // Si no se encuentra el usuario
        if (!usuario) {
            return res.status(401).json({ message: "Credenciales no existentes u incorrectas" });
        }

        // Comparar la contraseña ingresada (en texto plano) con la encriptada
        const isMatch = await usuario.verificarContrasena(contrasena);
        if (isMatch) {
            return res.status(200).json({
                message: "Inicio de sesión exitoso",
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                ID_Rol:usuario.ID_Rol,
                id:usuario.id
            });
        } else {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }
    });
};

module.exports = { loginUser };

