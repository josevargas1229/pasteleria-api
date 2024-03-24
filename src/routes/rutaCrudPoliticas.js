import { Router } from 'express'
import {crearPolitica } from '../controllers/CrudPoliticas.js';

export const crudPoliticasRouter = Router();

//crear una politica
crudPoliticasRouter.post('', crearPolitica);

