import { request, response } from "express";
import path from 'path';
import * as url from 'url';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

import { subirArchivo } from "../helpers/subir-archivo.js";
import { Producto, Usuario } from "../models/index.js";

const root = url.fileURLToPath(new URL('.', import.meta.url));

export const cargarArchivo = async ( req = request, res = response ) => {

    try {
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );
        return res.json({ nombre });
    } catch (msg) {
        res.status(400).json({ msg });
    }

}

export const actualizarImagen = async ( req = request, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;
    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
        break;
    }

    // Limpiar imágenes previas
    if( modelo.img ) {
        // Hay que borrar la imágen del servidor
        const pathImagen = path.join( root, '../uploads/', coleccion, modelo.img );
        if( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen );
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.json({ modelo });
}

export const actualizarImagenCloudinary = async ( req = request, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;
    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
        break;
    }

    // Limpiar imágenes previas
    if( modelo.img ) {
        const [ nombre ] = modelo.img.split('/').slice(-1);
        const [ public_id ] = nombre.split('.');

        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    modelo.img = secure_url;

    await modelo.save()

    return res.json( modelo );
}

export const mostrarImagen = async ( req = request, res = response ) => {
    
    const { id, coleccion } = req.params;
    const pathNoImage = path.join( root, '../assets/no-image.jpg' );
    let modelo;
    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ) {
                return res.status(400).sendFile(pathNoImage);
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ) {
                return res.status(400).sendFile(pathNoImage);
            }
        break;
        default:
            return res.status(500).sendFile(pathNoImage);
    }

    // Limpiar imágenes previas
    if( modelo.img ) {
        // Hay que borrar la imágen del servidor
        const pathImagen = path.join( root, '../uploads/', coleccion, modelo.img );
        if( fs.existsSync( pathImagen ) ) {
            return res.json({ msg: 'Falta placeholder' }).sendFile( pathImagen )
        }
    }

    return res.sendFile(pathNoImage);
}