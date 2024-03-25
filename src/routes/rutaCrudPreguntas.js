import { Router } from 'express';
import { crearPregunta, eliminarPregunta, editarPregunta} from '../controllers/CrudPreguntas.js';

export const crudPreguntasRouter = Router();

// Crear una pregunta
crudPreguntasRouter.post('', crearPregunta);


//vista de por medio 
crudPreguntasRouter.delete('/:id', eliminarPregunta);

//se agregaron dos cosas linea 2 y linea 11 es todo 

crudPreguntasRouter.put('/:id', editarPregunta);