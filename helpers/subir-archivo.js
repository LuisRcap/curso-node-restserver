import { v4 as uuidv4 } from 'uuid';
import path from 'path'
import * as url from 'url';

const root = url.fileURLToPath(new URL('.', import.meta.url));

export const subirArchivo = ( files, extensionesValidas = [ 'png', 'jpg', 'jpeg', 'gif' ], carpeta = '' ) => {
    return new Promise( ( resolve, reject ) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado.slice(-1)[0];
    
        // Validar la extensión
        if( !extensionesValidas.includes( extension ) ){
            return reject(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`);
        }
        
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( root, '../uploads/', carpeta, nombreTemp );
      
        archivo.mv( uploadPath, (err) => {
          if (err) {
            reject(err)
          }
      
          resolve(nombreTemp)
        });
    });
}