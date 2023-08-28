import { request, response } from "express";
import { Types } from "mongoose";
import { Categoria, Producto, Usuario } from "../models/index.js";

const { ObjectId } = Types;

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'producto',
    'roles'
]

const buscarUsuarios = async ( termino = '', res = response ) => {
    const esMongoID = ObjectId.isValid( termino ); // TRUE

    try{
        console.log("Paso por aqui");
        if( esMongoID ) {
            const usuario = await Usuario.findById(termino);
            return res.json({
                results: usuario ? [ usuario ] : []
            })
        }
        return res.status(500).json({
            msg: "Algo salió mal al búscar usuario"
        })
    } catch( err ) {
        console.log( "Error: " + err );
        return res.status(500).json({
            msg: "Algo salió mal al búscar usuario"
        })
    }
}

export const buscar = async ( req = request, res = response ) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas.join(', ') }`
        })
    }
    
    switch( coleccion ) {
        case 'usuarios':
            buscarUsuarios( termino, res );
        break;
        case 'categoria':
        break;
        case 'producto':
        break;
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            })
        break;
    }
};