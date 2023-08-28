import { request, response } from "express";
import { Categoria } from '../models/index.js';

// obtenerCategorias - paginado - total - populate
export const obtenerCategorias = async ( req = request, res = response ) => {
    const { paginacion = 1 } = req.body;
    const query = { estado: true };

    try{
        const [ total, categorias ]= await Promise.all([
            Categoria.countDocuments( query ),
            Categoria.find( query )
                .populate( 'usuario', 'nombre' )
                .skip( ( Number( paginacion ) - 1) * 5 )
                .limit( Number( 5 ) )
        ]).catch( errors => {
            console.log( "Error al obtener los datos " + errors );
        });
    
        return res.status(200).json({
            total,
            categorias
        })

    } catch ( err ) {

        return res.json(500).json({
            msg: 'Error al consultar categorias'
        })
    }

}

// obtenerCategoria - populate {}
export const obtenerCategoria = async ( req = request, res = response ) => {
    const { id } = req.params;

    try {
        const categoria = await Categoria.findOne( { _id: id, estado: true } )
            .populate('usuario', 'nombre');

        return res.status(200).json({
            msg: "Categoría encontrada",
            categoria
        })
    } catch( err ) {
        return res.status(500).json({
            msg: "Error al obtener los datos de la categoría"
        })
    }
}

export const crearCategoria = async ( req = request, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre, estado: true });

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    };

    const categoria = new Categoria( data );

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria)

}

// actualizarCategoria
export const actualizarCategoria = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id

    try {
        const categoriaDB = await Categoria.findOne({ nombre: data.nombre, estado: true });

        if( categoriaDB ) {
            return res.status(400).json({
                msg: `La categoria ${ categoriaDB.nombre }, ya existe`
            });
        }
        
        const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true });
    
        return res.json({
            msg: `Categoría con el id ${ id } actualizada correctamente a ${ data.nombre }`,
            categoriaAnterior: categoria
        });
    } catch( err ) {
        console.log("Error: " + err );
        return res.status(500).json({
            msg: "Error al acutalizar la categoría"
        })
    }

}

// borrarCategoria - estado: false
export const borrarCategoria = async ( req = request, res = response ) => {
    const { id } = req.params;

    try {
        const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true });

        return res.status(200).json({
            categoriaBorrada
        })

    } catch( err ) {
        return res.status(500).json({
            msg: "Error al borrar categoría"
        });
    }

}