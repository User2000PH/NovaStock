import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  editando = false;
  guardando = false;
  error = '';
  mensaje = '';

  categorias = [
    'Computadoras',
    'Accesorios',
    'Perifericos',
    'Almacenamiento',
    'Otros'
  ];

  producto: Producto = {
    codigo: '',
    nombre: '',
    categoria: 'Accesorios',
    precio: 0,
    stock: 0,
    descripcion: ''
  };

  constructor(
    private servicio: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.editando = true;

    this.servicio.obtener(id).subscribe({
      next: datos => this.producto = datos,
      error: () => this.error = 'No se pudo cargar el producto.'
    });
  }

  guardar(): void {
    this.error = '';
    this.mensaje = '';

    const p = this.producto;

    if (
      !p.codigo.trim() ||
      p.nombre.trim().length < 2 ||
      !p.categoria ||
      !Number.isFinite(Number(p.precio)) ||
      Number(p.precio) <= 0 ||
      !Number.isInteger(Number(p.stock)) ||
      Number(p.stock) < 0
    ) {
      this.error = 'Revisa los campos. El precio debe ser mayor que cero y el stock un entero no negativo.';
      return;
    }

    this.guardando = true;

    const operacion = this.editando && p._id
      ? this.servicio.actualizar(p._id, p)
      : this.servicio.crear(p);

    operacion.subscribe({
      next: respuesta => {
        this.mensaje = respuesta.mensaje;
        this.guardando = false;
        this.router.navigate(['/productos']);
      },
      error: err => {
        this.error = err.error?.mensaje || 'No se pudo guardar el producto.';
        this.guardando = false;
      }
    });
  }
}