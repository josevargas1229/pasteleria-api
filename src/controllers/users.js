
import { usersSchema } from '../models/users.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds = 10;
// Operación de Crear Usuario
export const crearUsuario = async (req, res) => {
    try {
        console.log(req.body);
        const { datosCuenta: { password, preguntaRecuperacion: { respuesta: respuestaPregunta }, email }, telefono, ...restUserData } = req.body;
        const respuestaPreguntaLowercase = respuestaPregunta.toLowerCase();
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(telefono)
        console.log(email)
        // Verificar si ya existe un usuario con el mismo correo electrónico o teléfono
        const usuarioExistente = await usersSchema.findOne({ 'telefono': telefono });
        console.log(usuarioExistente)
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El teléfono ya está registrado.' });
        }

        const usuarioExistenteEmail = await usersSchema.findOne({ 'datosCuenta.email': email });
        if (usuarioExistenteEmail) {
            return res.status(400).json({ message: 'El email ya está registrado.' });
        }
        const nuevoUsuario = new usersSchema({
            ...restUserData,
            datosCuenta: {
                ...req.body.datosCuenta,
                password: hashedPassword,
                rol: 'usuario',
                imagenPerfil:'https://res.cloudinary.com/dy1ejxiua/image/upload/v1711231469/Usuarios/icon-1633249_1280_rf2ucd.png',
                preguntaRecuperacion: {
                    ...req.body.datosCuenta.preguntaRecuperacion,
                    respuesta: respuestaPreguntaLowercase
                }
            },
            telefono
        });
        console.log(nuevoUsuario);

        await nuevoUsuario.save();

        jwt.sign({ id: nuevoUsuario._id, email: nuevoUsuario.datosCuenta.email, rol: nuevoUsuario.datosCuenta.rol }, 'secret', { expiresIn: "1d" }, (err, token) => {
            if (err) return res.status(500).json({ message: err.message });
            const ahora = new Date();
            const unDiaDespues = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
            res.status(201).cookie('token', token, { path: '/', sameSite: 'none', secure: true, expires: unDiaDespues });
            res.json({ id: nuevoUsuario._id, email: nuevoUsuario.datosCuenta.email, role: nuevoUsuario.datosCuenta.rol });
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Operación de Leer todos los Usuarios
export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await usersSchema.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Operación de Leer un Usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await usersSchema.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Operación de Actualizar Usuario por ID
export const actualizarUsuario = async (req, res) => {
    try {
        const { datosCuenta: { password, ...restDatosCuenta }, ...restUserData } = req.body;

        // Verificar si se proporcionó una nueva contraseña
        if (password) {
            // Hashear la nueva contraseña
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            req.body.datosCuenta.password = hashedPassword;
        }

        // Realizar la actualización manual
        const usuario = await usersSchema.findByIdAndUpdate(
            req.params.id,
            {
                ...restUserData,
                datosCuenta: {
                    ...restDatosCuenta,
                    ...req.body.datosCuenta
                }
            },
            { new: true }
        );

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Operación de Eliminar Usuario por ID
export const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await usersSchema.findByIdAndDelete(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//buscar un usuario por email
// Operación de Leer un Usuario por Correo Electrónico
export const obtenerUsuarioPorEmail = async (req, res) => {
    try {
        const { email } = req.body; // Obtener el email del cuerpo de la solicitud
        const usuario = await usersSchema.findOne({ 'datosCuenta.email': email });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const ahora = new Date();
        const unDiaDespues = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
        const tokenR = await jwt.sign({ userId: usuario._id, recuperar: true }, 'secret', { expiresIn: "1d" })
        // Establecer la cookie y enviar los datos del usuario en una sola respuesta
        res.status(200)
            .cookie('tokenR', tokenR, { path: '/', sameSite: 'none', secure: true, expires: unDiaDespues })
            .json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const cambiarContrasena = async (req, res) => {
    try {
        
        const { userId,newPassword } = req.body; // Obtener la nueva contraseña del cuerpo de la solicitud

        // Verificar si se proporcionó una nueva contraseña
        if (!newPassword) {
            return res.status(400).json({ message: 'Se requiere una nueva contraseña' });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Actualizar la contraseña del usuario en la base de datos
        const usuarioActualizado = await usersSchema.findByIdAndUpdate(
            userId,
            { 'datosCuenta.password': hashedPassword }, // Actualizar el campo de contraseña en los datos de la cuenta
            { new: true } // Devolver el documento actualizado
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};