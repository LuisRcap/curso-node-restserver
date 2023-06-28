import Role from '../models/role.js';
import Usuario from '../models/usuario.js';

export const isValidRole = async ( role = '') => {
    const roleExist = await Role.findOne({ role });

    if( !roleExist ) {
        throw new Error( `El rol ${ role } no está registrado en la BD` );
    }
}

export const emailExists = async ( correo = '' ) => {
    const exists = await Usuario.findOne({ correo });
    if ( exists ) {
        throw new Error( `El correo '${ correo }' ya está registrado` );
    }
}

export const existeUsuarioPorId = async( id ) => {
    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario ) {
        throw new Error( `El id no existe ${ id }` );
    }
}