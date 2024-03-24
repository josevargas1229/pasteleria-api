import { Router } from 'express'
import { productsSchema } from '../models/products.js'
import { categorySchema } from '../models/categorias.js';
import { flavorSchema } from '../models/sabores.js';

export const productRouter = Router()
//obtener todos los productos
productRouter.get('', async(req, res) => {
    try {
        const tipo = req.query.tipo;
        const sabor = req.query.sabor;
    
        let query = {};
        if (tipo) {
            query.tipo = tipo;
        }
        if (tipo !== 'complemento' && sabor) {
            query.sabor = sabor;
        }
        
        const productos = await productsSchema.find(query);
        if (productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos que coincidan con la búsqueda.' });
        }
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un problema al buscar los productos.' });
    }
})

productRouter.get('/categorias', async (req, res) => {
    try {
        // Buscar todas las categorías
        const categorias = await categorySchema.find();

        // Verificar si se encontraron categorías
        if (!categorias || categorias.length === 0) {
            return res.status(404).json({ message: 'No se encontraron categorías.' });
        }

        // Enviar las categorías encontradas como respuesta
        res.status(200).json(categorias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un problema al buscar las categorías.' });
    }
});

productRouter.get('/sabores', async (req, res) => {
    try {
        // Buscar todos los sabores
        const sabores = await flavorSchema.find();

        // Verificar si se encontraron sabores
        if (!sabores || sabores.length === 0) {
            return res.status(404).json({ message: 'No se encontraron sabores.' });
        }

        // Enviar los sabores encontrados como respuesta
        res.status(200).json(sabores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un problema al buscar los sabores.' });
    }
});

//buscar un producto por tipo
productRouter.get('/tipo/:tipo',(req,res)=>{
    const tipo=req.params.tipo
    productsSchema.find({tipo:tipo})
    .then(data => {
        if (!data)
            res.status(404).json({ message: 'Productos no encontrados' })
        else
            res.json(data)
    })
    .catch(error => res.status(400).json({ message: error }))
})

//buscar un producto por id
productRouter.get('/:id', (req, res) => {
    const id  = req.params.id
    productsSchema.findById(id)
        .then(data => {
            if (!data)
                res.status(404).json({ message: 'Producto no encontrado' })
            else
                res.json(data)
        })
        .catch(error => res.status(400).json({ message: error }))
})
//crear un producto
productRouter.post('',async(req,res)=>{

})
//actualizar un producto
productRouter.put('/:id',async(req,res)=>{

})
//eliminar un producto
productRouter.delete('/:id',async(req,res)=>{
    
})