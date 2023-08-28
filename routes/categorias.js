import { Router } from 'express';
import { check } from 'express-validator';

import { 
    esAdminRole,
    validarCampos,
    validarJWT
} from '../middlewares/index.js'
import { 
    actualizarCategoria,
    borrarCategoria,
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias
} from '../controllers/categorias.js';
import { existeCategoria } from '../helpers/db-validators.js';

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorías - público
router.get( '/', [
    check( 'paginacion', 'Debe ser un número' ).optional().isNumeric(),
    validarCampos
], obtenerCategorias );

// Obtener una categoría por id - público
router.get( '/:id', [
    check( 'id', 'Debe ser un OID válido' ).isMongoId(),
    check( 'id' ).custom( existeCategoria ),
    validarCampos
], obtenerCategoria);

// Crear categroría - privado - cualquier persona con un token válido
router.post( '/', [
    validarJWT,
    check( 'nombre', 'El nombre es obligatorio y debe ser una cadena de texto' ).not().isEmpty().isString(),
    validarCampos
], crearCategoria);

// Actualizar - privado - cualquiera con token válido
router.put( '/:id', [
    validarJWT,
    check( 'id', 'Debe ser un OID válido' ).isMongoId(),
    check( 'id' ).custom( existeCategoria ),
    check( 'nombre', "Debe ser una cadena de texto" ).not().isEmpty().isString(),
    validarCampos
], actualizarCategoria);

// Borrar una categoría - Admin
router.delete( '/:id', [
    validarJWT,
    esAdminRole,
    check( 'id', 'Debe ser un OID válido' ).isMongoId(),
    check( 'id' ).custom( existeCategoria ),
    validarCampos
], borrarCategoria);

export default router;