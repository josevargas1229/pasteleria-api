import express, { json } from 'express'
import dotenv from "dotenv";
import cors from 'cors';
import { questionRouter } from './src/routes/questions.js';
import { usersRouter } from './src/routes/users.js';
import { authRouter } from './src/routes/auth.js';
import { verificarToken, verificarTokenAdmin, verificarTokenUsuario } from './src/middlewares/verificarToken.js';
import { userRouter } from './src/routes/user.js';
import { recuperacionRouter } from './src/routes/recuperacion.js';
import { imagesRouter } from './src/routes/images.js';
import { productRouter } from './src/routes/products.js';
import cookieParser from 'cookie-parser';
import { deviceRouter } from './src/routes/device.js';
import { crudProductsRouter } from './src/routes/rutaCrudProducts.js';
import { crudPoliticasRouter } from './src/routes/rutaCrudPoliticas.js';
import { politicasRouter } from './src/routes/verPoliticas.js';
import { deviceMRouter } from './src/routes/deviceMovil.js';
import { crudPreguntasRouter } from './src/routes/rutaCrudPreguntas.js';
import { preguntasRouter } from './src/routes/verPreguntas.js';

dotenv.config();
const app = express()
app.use(json())
app.disable('x-powered-by')
app.use(cookieParser())
const ACCEPTEP_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:4200',
    'https://lively.uthhtics.com/',
    'https://uthhtics.com/'
]



const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || ACCEPTEP_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
app.use(cors());

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return res.status(200).send('<h1>Hola mundo</h1>')
})


app.use('/usuarios', usersRouter)
app.use('/productos', productRouter)
app.use('/questions', questionRouter)
app.use('/auth', authRouter)
app.use('/user', verificarTokenUsuario, userRouter)
app.use('/admin', verificarTokenAdmin)
app.use('/recovery', verificarToken, recuperacionRouter)
app.use('/images', imagesRouter)
app.use('/devices', deviceRouter)
app.use('/devicesMovil', verificarTokenUsuario, deviceMRouter)
app.use('/crudProducts', crudProductsRouter)
app.use('/politicas', crudPoliticasRouter)
app.use('/verPoliticas1', politicasRouter)
app.use('/pregun', crudPreguntasRouter)
app.use('/permite', preguntasRouter)
// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
    next()
});

export default app;