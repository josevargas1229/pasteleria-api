import { Router } from 'express';
import { preguntasSchema } from '../models/preguntas.js';
import { eliminarPregunta, editarPregunta } from '../controllers/CrudPreguntas.js';

export const preguntasRouter = Router();

preguntasRouter.get('', (req, res) => {
    preguntasSchema.find()
        .then(data => {
            if (!data)
                res.status(404).json({ message: 'Preguntas no encontradas' })
            else
                res.json(data)
        })
        .catch(error => res.status(400).json({ message: error }))
});

preguntasRouter.delete('/:id', eliminarPregunta);

// Manejar solicitudes de edición utilizando el método put de preguntasRouter
preguntasRouter.put('/:id', editarPregunta);

export default preguntasRouter;