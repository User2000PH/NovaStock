import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, RespuestaProducto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly apiUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  obtener(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  crear(producto: Producto): Observable<RespuestaProducto> {
    return this.http.post<RespuestaProducto>(this.apiUrl, producto);
  }

  actualizar(
    id: string,
    producto: Producto
  ): Observable<RespuestaProducto> {
    return this.http.put<RespuestaProducto>(
      `${this.apiUrl}/${id}`,
      producto
    );
  }

  eliminar(id: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/${id}`
    );
  }
}