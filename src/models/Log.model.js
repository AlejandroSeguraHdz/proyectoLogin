import mongoose from "mongoose";

const logsSchema = mongoose.Schema({
    tipo: {type: String, required: true, trim: true},
    descripcion: {type: String, required: true, trim: true}
},
{
    timestamps:true
}
)

export default mongoose.model("Log", logsSchema)