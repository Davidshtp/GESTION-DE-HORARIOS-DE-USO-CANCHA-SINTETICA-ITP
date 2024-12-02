const bcrypt = require('bcryptjs');
const Usuario = require('../servidor/models/usuarioModel'); // Importa tu modelo Usuario

describe('Usuario Model', () => {
    let usuario;

    beforeEach(() => {
        // Antes de cada prueba, crea un nuevo usuario con contraseña encriptada
        const contrasenaEncriptada = bcrypt.hashSync('password123', 10);
        usuario = new Usuario('123', 'David', 'Pérez', contrasenaEncriptada);
    });

    it('debería verificar correctamente una contraseña válida', async () => {
        const resultado = await usuario.verificarContrasena('password123');
        expect(resultado).toBe(true); // Debería retornar true
    });

    it('debería rechazar una contraseña incorrecta', async () => {
        const resultado = await usuario.verificarContrasena('incorrecta');
        expect(resultado).toBe(false); // Debería retornar false
    });

    it('debería tener los atributos correctos después de la inicialización', () => {
        expect(usuario.identificacion).toBe('123');
        expect(usuario.nombre).toBe('David');
        expect(usuario.apellido).toBe('Pérez');
        expect(usuario.contrasena).toBeTruthy(); // Verifica que la contraseña no sea nula
    });
});