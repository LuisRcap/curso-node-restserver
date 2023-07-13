import { Router } from 'express';
import { check } from 'express-validator';

import { 
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole 
} from '../middlewares/index.js'

import { emailExists, existeUsuarioPorId, isValidRole } from '../helpers/db-validators.js';

import { 
    usuariosDelete,
    usuariosGet,
    usuariosPatch,
    usuariosPost,
    usuariosPut
} from '../controllers/usuarios.js';

const router = Router();

router.get('/:paginacion?', [
    check( 'paginacion', 'Debe ser un número' ).optional().isNumeric(),
    validarCampos
], usuariosGet )

router.put('/:id', [
    check( 'id', 'No es un ID válido' ).isMongoId(),
    check( 'id' ).custom( existeUsuarioPorId ),
    check( 'role' ).custom( isValidRole ),
    validarCampos
], usuariosPut)

router.post('/', [
    check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
    check( 'password', 'El password debe de ser de más de 6 letras' ).isLength({ min: 6 }),
    check( 'correo', 'El correo no es válido' ).isEmail(),
    check( 'correo' ).custom( emailExists ),
    // check( 'role', 'No es un rol válido' ).isIn([ 'ADMIN_ROLE', 'USER_ROLE' ]),
    check( 'role' ).custom( isValidRole ),
    validarCampos
], usuariosPost)

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole( 'ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE' ),
    check( 'id', 'No es un ID válido' ).isMongoId(),
    check( 'id' ).custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete)

router.patch('/', usuariosPatch)

export default router