import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  productos: Producto[] = [];
  error = '';

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.listar().subscribe({
      next: (datos) => this.productos = datos,
      error: () => this.error = 'No se pudo cargar el inventario.'
    });
  }

  get unidades(): number {
    return this.productos.reduce((total, p) => total + p.stock, 0);
  }

  get valorInventario(): number {
    return this.productos.reduce(
      (total, p) => total + p.precio * p.stock, 0
    );
  }

  get stockBajo(): Producto[] {
    return this.productos.filter(p => p.stock <= 5);
  }
}