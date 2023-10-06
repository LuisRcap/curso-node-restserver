import { Schema, model } from 'mongoose';

const ProductoSchema = new Schema({
    nombre: {
        type: String,
        required: [ true, 'El nombre es obligatorio' ]
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: String,
    disponible: {
        type: Boolean,
        default: true
    },
    img: String
});

ProductoSchema.methods.toJSON = function () {
    const { __v, estado, _id, ...data } = this.toObject();
    data.id = _id;
    return data;
}

export default model( 'Producto', ProductoSchema );