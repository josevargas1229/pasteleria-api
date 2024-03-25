import { Router } from "express";
import Historico from "../models/device_historic.js";
import Dispositivo from "../models/device.js";
import * as mongoose from "mongoose";
import { usersSchema } from "../models/users.js";
export const deviceMRouter = Router()

//obtener los dispositivos de un usuario (usuario normal)
deviceMRouter.get('/user', async (req, res) => {
    try {
        const { userId:id } = req.userData;
        const usuario = await usersSchema.findById(id).populate('dispositivos.idDispositivo');
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(usuario.dispositivos)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//Obtener un dispositivo por id (usuario normal)
deviceMRouter.get('/:id', async (req, res) => {
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




//Ruta para cambiar el valor de una variable desde el front (usuario normal)
deviceMRouter.post('/actualizarVariable/:id',async(req,res)=>{
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
deviceMRouter.post('/:id/label', async (req, res) => {
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
deviceMRouter.post('/:id/variable',async(req,res)=>{
    try {
        const {variable}=req.body
        const dataVariable=await Historico.find({variable:variable})
        console.log(dataVariable)
        res.status(200)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//eliminar un dispositivo (admin)
deviceMRouter.delete('/:id', async (req, res) => {
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
