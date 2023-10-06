import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos, validarArchivoSubir } from '../middlewares/index.js';

import { actualizarImagenCloudinary, cargarArchivo, mostrarImagen } from '../controllers/uploads.js';
import { coleccionesPermitidas } from '../helpers/db-validators.js';

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put( '/:coleccion/:id', [
    validarArchivoSubir,
    check( 'id', 'Este id debe ser un Mongo ID' ).isMongoId(),
    check( 'coleccion' ).custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagenCloudinary );

router.get( '/:coleccion/:id', [
    check( 'id', 'Este id debe ser un Mongo ID' ).isMongoId(),
    check( 'coleccion' ).custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagen )

export default router;