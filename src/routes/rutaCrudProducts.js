import { Router } from 'express'
import { crearProducto,modificarProducto,eliminarProducto} from '../controllers/CrudProducts.js';
import { multerConfig } from '../utilities/multer.js';
export const crudProductsRouter = Router();

//crear un producto
crudProductsRouter.post('', multerConfig.single('imagen'),crearProducto);
//actualizar un producto por id
crudProductsRouter.put('/:id', multerConfig.single('imagen'),modificarProducto);
//eliminar un producto por id
crudProductsRouter.delete('/:id', eliminarProducto);
