import axios from "./axios"

export const  getProductosRequest = async () => axios.get(`/producto`);
export const  getProductoRequest = async (id) => axios.get(`/producto/${id}`);
export const  createProductoRequest = async (producto) => axios.post(`/producto`,producto);
export const  updateProductoRequest = async (id,producto) => axios.put(`/producto/${id}`,producto);
export const  deleteProductoRequest = async (id) => axios.delete(`/producto/${id}`);

export const  getProductosDesactivadosRequest = async (id) => axios.get(`/productos-desactivados`);
export const  activarProductoRequest = async (id) => axios.delete(`/activar-producto/${id}`);
