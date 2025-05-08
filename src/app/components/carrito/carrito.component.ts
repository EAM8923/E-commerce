import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';

declare var paypal: any;

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent {
  carrito: any[] = [];
  recibo: string = '';

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.carrito = this.carritoService.obtenerCarrito();
  }

  ngAfterViewInit() {
    if (this.carrito.length > 0) {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [{
              amount: {
                currency_code: 'USD',
                value: this.calcularTotal().toFixed(2)
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            alert('Pago completado por ' + details.payer.name.given_name);
            this.carritoService.vaciarCarrito();
            this.router.navigate(['/productos']);
          });
        },
        onError: (err: any) => {
          console.error('Error detallado en el pago:', err);
          alert('Error al procesar el pago: ' + (err.message || 'Error desconocido'));
        }
      }).render('#paypal-button-container');
    }
  }

  eliminarProducto(index: number) {
    this.carritoService.eliminarProducto(index);
  }

  generarXML() {
    this.recibo = this.carritoService.generarXML();
  }

  calcularTotal() {
    return this.carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  }

  descargarXML() {
    const xmlData = this.carritoService.generarXML();
    const blob = new Blob([xmlData], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  irAProductos() {
    this.router.navigate(['/productos']);
  }
}