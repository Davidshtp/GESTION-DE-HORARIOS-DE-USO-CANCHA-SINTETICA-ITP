const bcrypt = require('bcryptjs');

class Usuario {
    constructor(id,identificacion, nombre, apellido, contrasena,ID_Rol) {
        this.id=id;
        this.identificacion = identificacion;
        this.nombre = nombre;
        this.apellido = apellido;
        this.contrasena = contrasena; 
        this.ID_Rol=ID_Rol;
    }

    async verificarContrasena(contrasenaIngresada) {
        return await bcrypt.compare(contrasenaIngresada, this.contrasena);
    }
}

module.exports = Usuario;
