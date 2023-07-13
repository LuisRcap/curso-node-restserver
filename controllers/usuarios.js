import { response, request } from "express";
import Usuario from '../models/usuario.js';
import bcryptjs from 'bcryptjs';

export const usuariosGet = async (req = request, res = response ) => {

    const { paginacion = 1 } = req.params;
    const query = { estado: true };

    const [ total, usuarios ]= await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
        .skip( ( Number( paginacion ) - 1) * 5 )
        .limit( Number( 5 ) )
    ]);

    res.json({
        total,
        usuarios
    })

}

export const usuariosPut = async (req = request, res = response) => {

    const { id } = req.params;

    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar contra BD
    if( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario )
}

export const usuariosPost = async (req = request, res = response) => {

    const { nombre, correo, password, role } = req.body;
    const usuario = new Usuario({ nombre, correo, password, role }); 

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en base de datos
    await usuario.save();

    res.status(500).json({
        msg: 'post API - controlador',
        usuario
    })
}

export const usuariosDelete = async (req = request, res = response) => {

    const { id } = req.params;

    const usuario = await Usuario. findByIdAndUpdate( id, { estado: false } )
    const usuarioAutenticado = req.usuario;

    res.json({ usuario });
}

export const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - controlador',
        id
    })
}