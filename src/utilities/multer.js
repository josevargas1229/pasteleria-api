import multer from "multer";

//modulo path para manejar Las rutas tanto relativas como absolutas de nuestra PC
// y de nuestro proyecto
import path from 'path';

//multer config
export const multerConfig = multer({
    //para decirle a multer donde guardaremos el archivo, en este caso Lo dejo vacio porque el archivo
    //sera subido a cloudinary
    storage: multer.diskStorage({}),
    //funcion para controlar que archivos son aceptados
    fileFilter: (req, file, cb) => {
        //originalname es el nombre del archivo en La computadora del usuario
        let ext = path.extname(file.originalname);

        // La función debe Llamar a “cb” usando una variable del tipo boolean
        // para indicar si el archivo debería ser aceptado o no
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
        // Para rechazar el archivo es necesario pasar “false”, de La siguiente forma:
        cb(
            new Error(
                "El formato de arhivo para la imagen no esta soportado, tiene que subir una imagen con extension jpg, jpeg o png"
            ),
            false
        );
        return;
    }


// Para aceptar el archivo es necesario pasar “true”, de La siguiente forma:
cb(null, true);
},
});