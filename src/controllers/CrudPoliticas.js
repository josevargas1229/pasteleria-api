import { politicasSchema } from '../models/politicas.js'; // Asegúrate de importar el esquema de políticas correctamente

// Operación de Crear Política
export const crearPolitica = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;    
        const nuevaPolitica = new politicasSchema({
            nombre,
            descripcion
        });
        await nuevaPolitica.save();
        res.status(201).json({ mensaje: 'Política agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar política:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

