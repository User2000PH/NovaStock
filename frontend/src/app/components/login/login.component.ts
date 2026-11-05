
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  error = '';
  cargando = false;

  formulario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  iniciarSesion(): void {
    this.error = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const email = this.formulario.value.email!;
    const password = this.formulario.value.password!;

    this.cargando = true;

    this.authService.iniciarSesion(email, password).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/']);
      },
      error: err => {
        this.cargando = false;
        this.error = err.error?.mensaje || 'No se pudo iniciar sesión.';
      }
    });
  }
}