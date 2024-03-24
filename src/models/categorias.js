import mongoose from 'mongoose';

export const categorySchema = mongoose.model(
    'categoria',
    mongoose.Schema({
        categoria: { type: String, required: true },
    })
);