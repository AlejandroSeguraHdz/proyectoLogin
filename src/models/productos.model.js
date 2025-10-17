
import mongoose from 'mongoose'

const esquemaProducto = new mongoose.Schema({
    sku:
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
    precio:
    {
        type: mongoose.Schema.Types.Double,
    },
    cantidad:
    {
        type: Number,
        required: true,
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

export default mongoose.model("Producto", esquemaProducto)