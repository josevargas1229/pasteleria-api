import mongoose from 'mongoose';

export const flavorSchema = mongoose.model(
    'sabores',
    mongoose.Schema({
        sabor: { type: String, required: true },
    })
);