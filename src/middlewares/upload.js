import multer from 'multer';
import path from 'path';

// --- FUNCIONES AUXILIARES NECESARIAS PARA DISK STORAGE ---
// Estas funciones se aseguran de que las rutas y nombres de archivo sean correctos
const getFilePath = (relativePath) => path.join(path.resolve(), relativePath);

// 1. Configurar el storage en disco
const storage = multer.diskStorage({
    // Indica a Multer dónde guardar los archivos temporalmente (la carpeta 'uploads' debe existir)
    destination: (req, file, cb) => {
        // El archivo se guarda en la carpeta 'uploads'
        cb(null, getFilePath('uploads')); 
    },
    // Define el nombre del archivo en el disco para evitar colisiones
    filename: (req, file, cb) => {
        // Ejemplo de nombre: imagen-1700000000-123456.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Usamos path.extname para preservar la extensión original
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
// -----------------------------------------------------------------

// 2. Inicializar Multer con Disk Storage y un límite de tamaño de archivo más seguro.
const upload = multer({
    storage: storage,
    // *******************************************************************
    // ** AUMENTO CLAVE DEL LÍMITE: 25 MB para archivos de alta resolución **
    // *******************************************************************
    limits: {
        fileSize: 25 * 1024 * 1024 // 25 MB en bytes.
    },
    // Opcional: Filtro para aceptar solo imágenes
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Aceptar archivo
        } else {
            // Rechazar archivo, puedes manejar este error en Express
            cb(new Error('Tipo de archivo no soportado. Sólo se permiten imágenes.'), false); 
        }
    }
});

export default upload;
