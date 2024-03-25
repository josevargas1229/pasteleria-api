import { productsSchema } from '../models/products.js';
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Crear un producto
export const crearProducto = async (req, res) => {
  try {
      const { nombre, descripcion, precio, tipo, sabor } = req.body;
      const tipoMin=tipo.toLowerCase();
      // Crear un objeto con los campos requeridos
      const productoExistente=await productsSchema.find({nombre:nombre})
      if (productoExistente){
        res.status(400).json({message:'El producto ya existe'}) 
      }
      const nuevoProducto = {
          nombre,
          descripcion,
          precio,
          tipo:tipoMin
      };

      // Agregar campos opcionales si están presentes en la solicitud
      if (req.file) {
        const resultado = await cloudinary.uploader.upload(req.file.path, { folder: 'Productos' });
        nuevoProducto.imagen = resultado.secure_url;
      }else{
        nuevoProducto.imagen="https://res.cloudinary.com/dy1ejxiua/image/upload/v1711231677/Productos/logo_xga9pp.png";
      }
      if (sabor) {
          nuevoProducto.sabor = sabor;
      }

      // Crear instancia del producto
      const producto = new productsSchema(nuevoProducto);

      // Guardar el nuevo producto en la base de datos
      const productoGuardado = await producto.save();
      
      // Devolver el producto creado como respuesta
      res.status(201).json(productoGuardado);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};


export const modificarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, tipo, stock, sabor } = req.body;

  try {
    const productoEncontrado = await productsSchema.findById(id);

    if (!productoEncontrado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Guardar la URL de la imagen actual
    const imagenAnterior = productoEncontrado.imagen;

    // Actualizar solo los campos que se proporcionan en la solicitud
    if (nombre) {
      productoEncontrado.nombre = nombre;
    }
    if (descripcion) {
      productoEncontrado.descripcion = descripcion;
    }
    if (precio) {
      productoEncontrado.precio = precio;
    }
    if (tipo) {
      productoEncontrado.tipo = tipo;
    }
    if (stock) {
      productoEncontrado.stock = stock;
    }
    if (sabor) {
      productoEncontrado.sabor = sabor;
    }

    // Actualizar imagen si se proporciona una nueva imagen en la solicitud
    if (req.file) {
      const resultado = await cloudinary.uploader.upload(req.file.path, { folder: 'Productos' });
      productoEncontrado.imagen = resultado.secure_url;
    }

    // Guardar los cambios en la base de datos
    await productoEncontrado.save();

    // Eliminar la imagen anterior de Cloudinary si se proporciona una nueva imagen
    if (req.file && imagenAnterior && imagenAnterior !== "https://res.cloudinary.com/dy1ejxiua/image/upload/v1711231677/Productos/logo_xga9pp.png") {
        await cloudinary.uploader.destroy(imagenAnterior);
      }

    res.json(productoEncontrado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const productoEncontrado = await productsSchema.findById(id);

    if (!productoEncontrado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminar la imagen asociada en Cloudinary si existe
    if (productoEncontrado.imagen) {
      await cloudinary.uploader.destroy(productoEncontrado.imagen);
    }

    await productoEncontrado.remove();

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
