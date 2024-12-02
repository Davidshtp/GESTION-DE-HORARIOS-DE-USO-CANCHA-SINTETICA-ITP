const { getUserById } = require('../servidor/models/userModel');
const Usuario = require('../servidor/models/usuarioModel');

// Simula la base de datos
jest.mock('mysql', () => {
    return {
        createConnection: jest.fn().mockReturnValue({
            query: jest.fn((query, params, callback) => {
                const mockUser = {
                    IDENTIFICACION: '123',
                    NOMBRE: 'David',
                    APELLIDO: 'Pérez',
                    CONTRASENA: 'hashedPassword',
                };
                callback(null, [mockUser]);
            }),
        }),
    };
});

describe('UserModel', () => {
    it('debería devolver un usuario cuando se le pasa una identificación válida', (done) => {
        getUserById('123', (err, usuario) => {
            expect(usuario).toBeInstanceOf(Usuario);
            expect(usuario.identificacion).toBe('123');
            expect(usuario.nombre).toBe('David');
            expect(usuario.apellido).toBe('Pérez');
            done();
        });
    });

    it('debería devolver null si no se encuentra el usuario', (done) => {
        // Modificar el comportamiento simulado para que no encuentre un usuario
        require('mysql').createConnection().query.mockImplementationOnce((query, params, callback) => {
            callback(null, []); // Simula que no encuentra usuarios
        });

        getUserById('999', (err, usuario) => {
            expect(usuario).toBeNull();
            done();
        });
    });
});