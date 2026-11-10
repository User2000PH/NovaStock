export interface Producto {
  _id?: string;
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RespuestaProducto {
  mensaje: string;
  producto: Producto;
}