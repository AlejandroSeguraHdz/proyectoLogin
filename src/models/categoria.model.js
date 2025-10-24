
import mongoose from 'mongoose'

const esquemaCategoria = new mongoose.Schema({
    codigo:
    {
        type: String,
        required: true, 
        unique: true
    },
    nombre:
    {
        type: String,
        required: true,
    },
    descripcion:
    {
        type: String,
    },
    activo:
    {
        type: Boolean,
        required: true,
        default: true
    },
},
    {
        timestamps: true
    }

)


export default mongoose.model("Categoria", esquemaCategoria)