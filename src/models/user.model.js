import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    noEmpleado: {type: String, required: true, trim: true},
    nombres: {type: String, required: true, trim: true},
    apellidoP: {type: String, required: true, trim: true},
    apellidoM: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true, unique: true},
    activo: {type: Boolean, required: true, default: true},
    password: {type: String, required: true},
},
{
    timestamps:true
}
)

export default mongoose.model("User", userSchema)