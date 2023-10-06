import { request, response } from "express";
import { Types } from "mongoose";
import { Categoria, Producto, Usuario } from "../models/index.js";

const { ObjectId } = Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async ( termino = '', res = response ) => {
    const esMongoID = ObjectId.isValid( termino ); // TRUE

    try{
        if( esMongoID ) {
            const usuario = await Usuario.findOne({ _id: termino, estado: true });
            return res.json({
                results: usuario ? [ usuario ] : []
            })
        }

        const regex = new RegExp( termino, 'i' )
        const usuarios = await Usuario.find({
            $or: [{ nombre: regex }, { correo: regex }],
            estado: true
            // $and: [{ estado: true }]
        });
        return res.status(200).json({
            results: usuarios
        })
        
    } catch( err ) {
        console.log( "Error: " + err );
        return res.status(500).json({
            msg: "Algo salió mal al búscar usuario"
        })
    }
}

const buscarCategorias = async ( termino = '', res = response ) => {
    const esMongoID = ObjectId.isValid( termino ); // TRUE

    try{
        if( esMongoID ) {
            const categoria = await Categoria.findOne({ _id: termino, estado: true });
            return res.json({
                results: categoria ? [ categoria ] : []
            })
        }

        const regex = new RegExp( termino, 'i' )
        const categorias = await Categoria.find({ nombre: regex, estado: true });
        return res.status(200).json({
            results: categorias
        })
        
    } catch( err ) {
        console.log( "Error: " + err );
        return res.status(500).json({
            msg: "Algo salió mal al búscar usuario"
        })
    }
}

const buscarProductos = async ( termino = '', res = response ) => {
    const esMongoID = ObjectId.isValid( termino ); // TRUE

    try{
        if( esMongoID ) {
            const producto = await Producto.findOne({ _id: termino, estado: true })
                .populate('categoria', 'nombre');

            return res.json({
                results: producto ? [ producto ] : []
            })
        }

        const regex = new RegExp( termino, 'i' )
        const productos = await Producto.find({ nombre: regex, estado: true })
            .populate('categoria', 'nombre')    
            .then( async results => {
                if (results.length > 0) return results;
                const productosPorCategoria = await Producto.find({ estado: true })
                    .populate({
                        path: 'categoria',
                        match: { nombre: regex }
                    })
                return productosPorCategoria.filter( result => result.categoria !== null )
            });
        return res.status(200).json({
            results: productos
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
        case 'categorias':
            buscarCategorias( termino, res );
        break;
        case 'productos':
            buscarProductos( termino, res );
        break;
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            });
        break;
    }
};