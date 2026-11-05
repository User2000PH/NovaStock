import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

interface RespuestaLogin {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  iniciarSesion(email: string, password: string): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(respuesta => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
      })
    );
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get usuario(): Usuario | null {
    const datos = localStorage.getItem('usuario');
    return datos ? JSON.parse(datos) as Usuario : null;
  }

  get estaAutenticado(): boolean {
    return !!this.token;
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
}