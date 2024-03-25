import { Router } from 'express';
import { crearPolitica, eliminarPolitica, editarPolitica } from '../controllers/CrudPoliticas.js';

export const crudPoliticasRouter = Router();

// Crear una política
crudPoliticasRouter.post('', crearPolitica);

// Eliminar una política
crudPoliticasRouter.delete('/:id', eliminarPolitica);

// Editar una política
crudPoliticasRouter.put('/:id', editarPolitica);