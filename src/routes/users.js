import { Router } from 'express'
import { cambiarContrasena,actualizarUsuario, crearUsuario, eliminarUsuario, obtenerUsuarioPorEmail, obtenerUsuarioPorId, obtenerUsuarios } from '../controllers/users.js';

export const usersRouter = Router();
//obtener todos los usuarios
usersRouter.get('', obtenerUsuarios);
//crear un usuario
usersRouter.post('', crearUsuario);
//obtener un usuario por email
usersRouter.post('/email', obtenerUsuarioPorEmail);
//obtener un usuario por id
usersRouter.get('/:id', obtenerUsuarioPorId);
//actualizar un usuario por id
usersRouter.put('/:id', actualizarUsuario);
//eliminar un usuario por id
usersRouter.delete('/:id', eliminarUsuario);

usersRouter.post('/cambiarContrasena', cambiarContrasena);