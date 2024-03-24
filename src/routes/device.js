import { Router } from "express";
import Historico from "../models/device_historic.js";
import Dispositivo from "../models/device.js";
import * as mongoose from "mongoose";
import { usersSchema } from "../models/users.js";
export const deviceRouter = Router()

//Obtener todos los dispositivos (administrador)
deviceRouter.get('', async (req, res) => {
    try {
        const dispositivos = await Dispositivo.find();
        res.status(200).json(dispositivos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
//obtener los usuarios (regulares) para asignarles dispositivos (administrador)
deviceRouter.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await usersSchema.find({ 'datosCuenta.rol': 'usuario' });
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
//Obtener un dispositivo por id (usuario normal)
deviceRouter.get('/:id', async (req, res) => {
    try {
        const dispositivo = await Dispositivo.findById(req.params.id);
        const { id } = req.params;

        const ultimosValores = await Historico.aggregate([
            {
                $match: {
                    idDevice: mongoose.Types.ObjectId.createFromHexString(id),
                },
            },
            {
                $sort: {
                    fecha: -1,
                },
            },
            {
                $group: {
                    _id: '$variable',
                    ultimoValor: { $first: '$valor' },
                    ultimaFecha: { $first: '$fecha' },
                },
            },
        ]);
        res.status(200).json({ dispositivo: dispositivo, variables: ultimosValores });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//crear un nuevo dispositivo (administrador)
deviceRouter.post('', async (req, res) => {
    try {
        const dispositivo = new Dispositivo
        dispositivo.temperatura = 0
        dispositivo.humedadRelativa = 0
        dispositivo.humedadSuelo = 0
        dispositivo.luminosidad = 0
        dispositivo.bomba = 0
        dispositivo.luces = 0
        dispositivo.turbinas = 0
        dispositivo.asignado = false
        await dispositivo.save();
        res.status(201).json({ message: 'Dispositivo creado con exito' })
    } catch (error) {

    }
})

//obtener los dispositivos de un usuario (usuario normal)
deviceRouter.post('/user', async (req, res) => {
    try {
        const { id } = req.body
        const usuario = await usersSchema.findById(id).populate('dispositivos.idDispositivo');
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(usuario.dispositivos)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//asignar un dispositivo a un usuario (administrador)
deviceRouter.post('/user/:id', async (req, res) => {
    try {
        const { dispositivoID } = req.body
        const usuario = await usersSchema.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        usuario.dispositivos.push({ idDispositivo: dispositivoID });
        await usuario.save();
        const dispositivo = await Dispositivo.updateOne({ _id: dispositivoID }, { asignado: true });

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Ruta para manejar la actualización de datos (de la ESP32)
deviceRouter.post('/actualizarDatos', async (req, res) => {
    try {
        const { device_label, temperatura, humedadRelativa, humedadSuelo, luminosidad, bomba, luces, turbinas } = req.body;
        //65ec920163a4ecc05c177e18
        // Verifica la existencia del dispositivo en la base de datos

        const existingDevice = await Dispositivo.findOne({ _id: device_label });
        if (!existingDevice) {
            return res.status(404).json({ message: 'La tarjeta no existe' });
        }

        // Actualiza los datos en el dispositivo si están presentes en la solicitud
        if (temperatura !== undefined) {
            existingDevice.temperatura = temperatura;
        }

        if (humedadRelativa !== undefined) {
            existingDevice.humedadRelativa = humedadRelativa;
        }
        if (humedadSuelo !== undefined) {
            existingDevice.humedadSuelo = humedadSuelo;
        }
        if (luminosidad !== undefined) {
            existingDevice.luminosidad = luminosidad;
        }
        if (bomba !== undefined) {
            existingDevice.bomba = bomba;
        }
        if (luces !== undefined) {
            existingDevice.luces = luces;
        }
        if (turbinas !== undefined) {
            existingDevice.turbinas = turbinas;
        }

        await existingDevice.save();

        // Registra en el historial si los datos están presentes en la solicitud
        if (temperatura !== undefined) {
            const historicotemperatura = new Historico({ idDevice: existingDevice._id, variable: 'Temperatura', valor: temperatura, fecha: new Date() });
            await historicotemperatura.save();
        }

        if (humedadRelativa !== undefined) {
            const historicohumedadRelativa = new Historico({ idDevice: existingDevice._id, variable: 'Humedad Relativa', valor: humedadRelativa, fecha: new Date() });
            await historicohumedadRelativa.save();
        }
        if (humedadSuelo !== undefined) {
            const historicohumedadSuelo = new Historico({ idDevice: existingDevice._id, variable: 'Humedad del Suelo', valor: humedadSuelo, fecha: new Date() });
            await historicohumedadSuelo.save();
        }
        if (luminosidad !== undefined) {
            const historicoluminosidad = new Historico({ idDevice: existingDevice._id, variable: 'Luminosidad', valor: luminosidad, fecha: new Date() });
            await historicoluminosidad.save();
        }

        if (bomba !== undefined) {
            const historicobomba = new Historico({ idDevice: existingDevice._id, variable: 'Bomba', valor: bomba, fecha: new Date() });
            await historicobomba.save();
        }
        if (luces !== undefined) {
            const historicoluces = new Historico({ idDevice: existingDevice._id, variable: 'Luces', valor: luces, fecha: new Date() });
            await historicoluces.save();
        }
        if (turbinas !== undefined) {
            const historicoturbinas = new Historico({ idDevice: existingDevice._id, variable: 'Turbinas', valor: turbinas, fecha: new Date() });
            await historicoturbinas.save();
        }

        // Retorna los datos actualizados
        const updatedData = await Dispositivo.findOne({ _id: device_label }, { humedadRelativa: 1, temperatura: 1, humedadSuelo: 1, luminosidad: 1, bomba: 1, luces: 1, turbinas: 1, _id: 0 });

        return res.json(updatedData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//Ruta para cambiar el valor de una variable desde el front (usuario normal)
deviceRouter.post('/actualizarVariable/:id',async(req,res)=>{
    try {
        const {id}=req.params;
        const {variable,valor}=req.body;
        const variableMin= variable.toLowerCase();
        const dispositivo = await Dispositivo.findById(id);
        if (!dispositivo) {
            return res.status(404).json({ error: 'Dispositivo no encontrado' });
        }
        dispositivo[variableMin]=valor;
        await dispositivo.save();
        const historico=new Historico({idDevice:dispositivo._id,variable:variable,valor:valor,fecha:new Date()})
        await historico.save();
        res.status(200).json({message:'Valor actualizado correctamente'})
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

//cambiar la etiqueta de un dispositivo (usuario normal)
deviceRouter.post('/:id/label', async (req, res) => {
    try {
        const { id } = req.params;
        const { label } = req.body;
        // Verifica si el dispositivo existe
        const dispositivo = await Dispositivo.findById(id);
        if (!dispositivo) {
            return res.status(404).json({ error: 'Dispositivo no encontrado' });
        }
    
        // Actualiza la etiqueta del dispositivo
        dispositivo.label = label;
        await dispositivo.save();
    
        res.status(200).json({ message: 'Etiqueta actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
        }
});

//traer los valores de una variable (usuario normal)
deviceRouter.post('/:id/variable',async(req,res)=>{
    try {
        const {variable}=req.body
        const dataVariable=await Historico.find({variable:variable})
        console.log(dataVariable)
        res.status(200)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//eliminar un dispositivo
deviceRouter.delete('/:id', async (req, res) => {
    try {
        const deviceId = req.params.id;
        const users = await usersSchema.find({ 'dispositivos.idDispositivo': deviceId });
        for (const user of users) {
            user.dispositivos = user.dispositivos.filter(dispositivo => dispositivo.idDispositivo.toString() !== deviceId);

            await user.save();
        }
        const device = await Dispositivo.findByIdAndDelete(deviceId);
        if (!device) {
            return res.status(404).json({ error: 'Dispositivo no encontrado' });
        }
        res.status(200).json({ message: 'Dispositivo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
