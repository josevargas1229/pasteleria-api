import mongoose from 'mongoose';

export const preguntasSchema = mongoose.model(
    'admpreguntas',
    mongoose.Schema({
        nombre: { type: String, required: true },
        descripcion: { type: [String], required: true }
    })
);