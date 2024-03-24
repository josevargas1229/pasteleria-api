import { Router } from 'express';
import { multerConfig } from '../utilities/multer.js';

import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const imagesRouter = Router();
imagesRouter.post('/product', multerConfig.single('imagen'), async (req, res) => {
  try {
    // Si estás utilizando multer como middleware de Express, el archivo se almacenará en req.file
    const resultado = await cloudinary.uploader.upload(req.file.path, { folder: 'Productos' });
    res.json({ url: resultado.url });
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    res.status(500).json({ error: 'Error al subir la imagen a Cloudinary' });
  }
});



export { imagesRouter };
