import express from 'express';
import cors from 'cors';

import userRouter from '../routes/usuarios.js'

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios'

        // Middlewares
        this.middlewares();

        // Rutas de mi alicación
        this.routes();
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
        this.app.use( this.usuariosPath, userRouter );

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log( "Servidor corriendo en puerto", this.port );
        });
    }

}

export default Server;