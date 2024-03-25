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
export const eliminarPolitica = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la política de los parámetros de la URL
        console.log('ID recibido:', id); // Agregar este console.log para verificar el ID recibido

        // Buscar la política por su ID y eliminarla de la base de datos
        await politicasSchema.findByIdAndDelete(id);

        res.status(200).json({ mensaje: 'Política eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar política:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Operación de Editar Política
export const editarPolitica = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la política de los parámetros de la URL
        const { nombre, descripcion } = req.body; // Obtener los datos de la política a editar

        // Buscar la política por su ID y actualizar los datos
        const politica = await politicasSchema.findByIdAndUpdate(id, { nombre, descripcion }, { new: true });

        if (!politica) {
            return res.status(404).json({ error: 'La política no existe' });
        }

        res.status(200).json({ mensaje: 'Política actualizada correctamente', politica });
    } catch (error) {
        console.error('Error al editar política:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};