
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  productos: Producto[] = [];
  busqueda = '';
  categoria = '';
  mensaje = '';
  error = '';
  cargando = false;

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error = '';

    this.productoService.listar().subscribe({
      next: (datos: Producto[]) => {
        this.productos = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos. Verifica que el servidor esté funcionando.';
        this.cargando = false;
      }
    });
  }

  get productosFiltrados(): Producto[] {
    const texto = this.busqueda.trim().toLowerCase();

    return this.productos.filter((p) => {
      const coincideTexto =
        p.nombre.toLowerCase().includes(texto) ||
        p.codigo.toLowerCase().includes(texto);

      const coincideCategoria =
        !this.categoria || p.categoria === this.categoria;

      return coincideTexto && coincideCategoria;
    });
  }

  eliminar(producto: Producto): void {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmar || !producto._id) {
      return;
    }

    this.mensaje = '';
    this.error = '';

    this.productoService.eliminar(producto._id).subscribe({
      next: () => {
        this.mensaje = 'Producto eliminado correctamente.';
        this.productos = this.productos.filter(
          (p) => p._id !== producto._id
        );
      },
      error: (err) => {
        console.error('Error al eliminar producto:', err);
        this.error = 'No se pudo eliminar el producto.';
      }
    });
  }

  editar(producto: Producto): void {
    if (producto._id) {
      this.router.navigate(['/productos/editar', producto._id]);
    }
  }

}