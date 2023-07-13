import express from 'express';
import cors from 'cors';

import authRouter from '../routes/auth.js'
import userRouter from '../routes/usuarios.js'
import { dbConnection } from '../database/config.js';

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi alicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        
        // CORS
        this.app.use( cors() );

        // Lectura y Parseo del body
        this.app.use( express.json() );
        
        // Directorio público
        this.app.use( express.static('public') )

    }

    routes() {

        // User Routes
        this.app.use( this.authPath, authRouter );
        this.app.use( this.usuariosPath, userRouter );

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log( "Servidor corriendo en puerto", this.port );
        });
    }

}

export default Server;