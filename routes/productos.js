import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existeCategoriaPorNombre, existeProductoPorId } from '../helpers/db-validators.js';
import { 
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProducto, 
    obtenerProductos
} from '../controllers/productos.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

const router = Router();

/**
 * {{url}}/api/productos
 */

// Obtener todos los productos - público
router.get( '/', [
    check( 'paginacion', 'Debe ser un número' ).optional().isNumeric(),
    validarCampos
], obtenerProductos);

// Obtener un producto por id - público
router.get( '/:id', [
    check( 'id', 'Debe ser un OID válido' ).isMongoId(),
    check( 'id' ).custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);

// Crear producto - privado - cualquier persona con un token válido
router.post( '/', [
    validarJWT,
    check( 'nombre', 'El nombre es obligatorio y debe ser una cadena de texto' ).not().isEmpty().isString(),
    check( 'precio', 'Debe ingresar un precio válido' ).optional().isNumeric(),
    check( 'categoria', 'Debe ingresar una categoría' ).isString(),
    check( 'categoria').custom( existeCategoriaPorNombre ),
    check( 'descripcion', 'Debe ingresar una descripción válida' ).optional().isString(),
    validarCampos
], crearProducto);

// Actualizar - privado - cualquiera con token válido
router.put( '/:id', [
    validarJWT,
    check( 'id', 'Debe ser un OID válido' ).isMongoId(),
    check( 'id' ).custom( existeProductoPorId ),
    check( 'nombre', "Debe ser una cadena de texto" ).optional().isString(),
    check( 'descripcion',"La descripción debe ser una cadena de texto" ).optional().isString(),
    check( 'precio', "Ingrese un precio válido" ).optional().isNumeric(),
    check( 'disponible', "Debe agregar una opción de disponibilidad válida" ).optional().isBoolean(),
    validarCampos
], actualizarProducto);

// Borrar una categoría - Admin
router.delete( '/:id', [
    validarJWT,
    esAdminRole,
    check( 'id', 'Debe ser un OID válido' ).isMongoId(),
    check( 'id' ).custom( existeProductoPorId ),
    validarCampos
], borrarProducto);

export default router;