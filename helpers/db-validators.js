import Role from '../models/role.js';
import { Usuario, Categoria, Producto } from '../models/index.js';

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
};

export const existeCategoria = async ( id ) => {
    // Verificar si la categoría existe en la DB
    const existeCategoriaPorId = await Categoria.findById( id );
    if( !existeCategoriaPorId ) {
        throw new Error( `El id no existe ${ id }` );
    }
}

// Función para validar si una categoría existe por un nombre
export const existeCategoriaPorNombre = async ( nombre = '', req ) => {
    
    // Verificar si la categoría existe en la DB
    const existeCategoria = await Categoria.findOne( { nombre: nombre.toUpperCase() } );
    if( !existeCategoria ) {
        throw new Error( `El nombre no existe ${ nombre }` );
    }

    req.req.categoria = existeCategoria;
};

// Función para validar si un producto existe por su ID
export const existeProductoPorId = async ( id = '', req ) => {
    // Verificar si la producto existe en la DB
    const existeProducto = await Producto.findById( id );
    if( !existeProducto ) {
        throw new Error( `El id no existe ${ id }` );
    }

    req.req.producto = existeProducto;
}