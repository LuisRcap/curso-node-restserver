import { Schema, model } from 'mongoose';

const CategoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [ true, 'El nombre es obligatorio' ],
        unique: true
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
    }
});

CategoriaSchema.methods.toJSON = function () {
    const { __v, estado, _id, ...data } = this.toObject();
    data.id = _id;
    return data;
}

export default model( 'Categoria', CategoriaSchema );