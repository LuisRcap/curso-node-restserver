import { response, request } from "express";

export const usuariosGet = (req = request, res = response ) => {

    const { q, nombre = "No name", apikey, page = 1, limit } = req.query

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    })

}

export const usuariosPut = (req = request, res = response) => {

    const { id } = req.params;

    res.json({
        msg: 'put API - controlador',
        id
    })
}

export const usuariosPost = (req = request, res = response) => {

    const { nombre, edad } = req.body;

    console.log( req.body )

    res.status(500).json({
        msg: 'post API - controlador',
        nombre,
        edad 
    })
}

export const usuariosDelete = (req = request, res = response) => {
    res.json({
        msg: 'delete API - controlador'
    })
}

export const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    })
}