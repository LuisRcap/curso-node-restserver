import { request, response } from "express";
import { Producto } from '../models/index.js';

// obtenerProducto - paginado - total - populate
export const obtenerProductos = async ( req = request, res = response ) => {
    const { paginacion = 1 } = req.body;
    const query = { estado: true, disponible: true };

    try{
        const [ total, productos ]= await Promise.all([
            Producto.countDocuments( query ),
            Producto.find( query )
                .populate( 'usuario', ['nombre', 'correo'] )
                .populate( 'categoria', 'nombre' )
                .skip( ( Number( paginacion ) - 1) * 5 )
                .limit( Number( 5 ) )
        ]).catch( errors => {
            console.log( "Error al obtener los datos " + errors );
        });
    
        return res.status(200).json({
            total,
            productos
        })

    } catch ( err ) {
        console.log( "Error: " + err );
        return res.json(500).json({
            msg: 'Error al consultar categorias'
        })
    }

}

// obtenerProducto - populate {}
export const obtenerProducto = async ( req = request, res = response ) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findOne( { _id: id, estado: true, disponible: true } )
            .populate('usuario', ['nombre', 'correo'])
            .populate('categoria', 'nombre');
        
        return res.status(200).json({
            msg: "Producto encontrado",
            producto
        })
    } catch( err ) {
        console.log( "Error: " + err );
        return res.status(500).json({
            msg: "Error al obtener los datos de la categoría"
        })
    }
}

// Crear producto
export const crearProducto = async ( req = request, res = response ) => {

    const { estado, usuario, nombre, categoria, disponible, ...data } = req.body;
    data.nombre = nombre.toUpperCase();

    try {
        const productoCategoria = await Producto.findOne({ nombre: data.nombre, estado: true, categoria: req.categoria._id });;
        
        if( productoCategoria ) {
            return res.status(400).json({
                msg: `El producto ${ productoCategoria.nombre }, ya existe en esta categoría`
            });
        }
    
        // Agregar data a guardar
        data.categoria = req.categoria._id;
        data.usuario = req.usuario._id
    
        const producto = new Producto( data );
    
        // Guardar DB
        await producto.save();
    
        res.status(201).json( producto )
    } catch( err ) {
        res.status(500).json({
            msg: "Error al crear el producto"
        })
    }

}

// actualizarProducto
export const actualizarProducto = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, _id, categoria, ...data } = req.body;
    if( Object.keys(data).length === 0 ){
        return res.status(400).json({
            msg: "Debe agregar al menos un campo a actualizar"
        })
    }
    
    data.nombre = data?.nombre?.toUpperCase() ?? undefined;
    data.usuario = req.usuario._id
    
    try {
        const productoDB = await Producto.findOne({ nombre: data.nombre, estado: true, categoria: req.producto.categoria});

        if( productoDB ) {
            return res.status(400).json({
                msg: `El producto ${ productoDB.nombre }, ya existe en esta categoría`
            });
        }

        const producto = await Producto.findByIdAndUpdate( id, data, { new: true });
    
        return res.json({
            msg: `Producto con el id ${ id } ha sido actualizado correctamente`,
            productoAnterior: producto
        });
    } catch( err ) {
        console.log("Error: " + err );
        return res.status(500).json({
            msg: "Error al acutalizar la producto"
        })
    }
};

// borrarProducto - estado: false
export const borrarProducto = async ( req = request, res = response ) => {
    const { id } = req.params;

    try {
        const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true });

        return res.status(200).json({
            productoBorrado
        })

    } catch( err ) {
        return res.status(500).json({
            msg: "Error al borrar producto"
        });
    }

}