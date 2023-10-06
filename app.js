import dotenv from 'dotenv';
dotenv.config()

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( JSON.parse( process.env.CLOUDINARY_URL ) );

import Server from './models/server.js';

const server = new Server();

server.listen();