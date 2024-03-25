import { preguntasSchema } from '../models/preguntas.js';

export const crearPregunta = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        const nuevaPregunta = new preguntasSchema({
            nombre,
            descripcion
        });

        await nuevaPregunta.save();

        res.status(201).json({ mensaje: 'Pregunta agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar pregunta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
//elimar por si no funciona
export const eliminarPregunta = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la pregunta de los parámetros de la URL
        console.log('ID recibido:', id); // Agregar este console.log para verificar el ID recibido

        // Buscar la pregunta por su ID y eliminarla de la base de datos
        await preguntasSchema.findByIdAndDelete(id);

        res.status(200).json({ mensaje: 'Pregunta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar pregunta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//paso 3
export const editarPregunta = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la pregunta de los parámetros de la URL
        const { nombre, descripcion } = req.body; // Obtener los datos de la pregunta a editar

        // Buscar la pregunta por su ID y actualizar los datos
        const pregunta = await preguntasSchema.findByIdAndUpdate(id, { nombre, descripcion }, { new: true });

        if (!pregunta) {
            return res.status(404).json({ error: 'La pregunta no existe' });
        }

        res.status(200).json({ mensaje: 'Pregunta actualizada correctamente', pregunta });
    } catch (error) {
        console.error('Error al editar pregunta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};