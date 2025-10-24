
import Categoria from '../models/categoria.model.js'

export const getCategorias = async (req,res) => {
    const categoria = await Categoria.find()
    res.json(categoria)

}

export const getCategoria = async (req,res) => {
    const categoria = await Categoria.findById(req.params.id)
    if(!categoria) return res.status(404).json({message: "Task no found"})
    res.json(task)
  
}

export const createCategoria = async (req,res) => {
    const {codigo, nombre,descripcion} = req.body

    const newCategoria = Categoria({
        codigo,
        nombre,
        descripcion,
    })
   const savedCategoria =  await newCategoria.save()
   res.json(savedCategoria)

}

export const deleteCategoria = async (req,res) => {
    const categoria = await Categoria.findByIdAndDelete(req.params.id)
    if(!categoria) return res.status(404).json({message: "Task no found"})
    return res.sendStatus(204)

}

export const updateCategoria = async (req,res) => {
     const  categoria = await Categoria.findByIdAndUpdate(req.params.id,req.body,{new: true})
    if(!categoria) return res.status(404).json({message: "Task no found"})
    res.json(categoria)

}