import { Router } from 'express'
import { productsSchema } from '../models/products.js'

export const productRouter = Router()
//obtener todos los productos
productRouter.get('', (req, res) => {
    productsSchema.find()
        .then(data => res.json(data))
        .catch(error => res.status(400).json({ message: error }))
})

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