import mongoose from 'mongoose';

export const politicasSchema = mongoose.model(
  'politicas',
  mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true }
  })
);