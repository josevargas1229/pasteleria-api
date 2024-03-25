import { Router } from 'express';
import { politicasSchema } from '../models/politicas.js';
import { eliminarPolitica, editarPolitica } from '../controllers/CrudPoliticas.js';

export const politicasRouter = Router();

politicasRouter.get('', (req, res) => {
  politicasSchema.find()
    .then(data => {
      if (!data)
        res.status(404).json({ message: 'Usuario no encontrado' });
      else
        res.json(data);
    })
    .catch(error => res.status(400).json({ message: error }));
});

politicasRouter.delete('/:id', eliminarPolitica);

politicasRouter.put('/:id', editarPolitica);

export default politicasRouter;