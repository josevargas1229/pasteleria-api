import mongoose from 'mongoose';

const dispositivoSchema = new mongoose.Schema({
    label:{type:String},
    clave:{type:String, unique: true},
    clienteID:{type:String, unique: true},
    temperatura: { type: Number, required: true },
    humedadRelativa: { type: Number, required: true },
    humedadSuelo: { type: Number, required: true },
    luminosidad: { type: Number, required: true },
    bomba: { type: Number, required: true },
    luces: { type: Number, required: true },
    turbinas: { type: Number, required: true },
    asignado: { type: Boolean },
    automatico: { type: Boolean }
}, { timestamps: true });

const Dispositivo = mongoose.model('Dispositivo', dispositivoSchema);

export default Dispositivo;
