import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Producto[] = [];

  obtenerCarrito(): Producto[] {
    return this.carrito;
  }

  eliminarProducto(index: number) {
    if (this.carrito[index].cantidad > 1) {
      this.carrito[index].cantidad--; // Reduce la cantidad
    } else {
      this.carrito.splice(index, 1); // Elimina el producto
    }
  }

  vaciarCarrito() {
    this.carrito = []; // Limpia el carrito
  }

  agregarProducto(producto: Producto) {
    const index = this.carrito.findIndex(p => p.id === producto.id);
    if (index > -1) {
      this.carrito[index].cantidad++; // Incrementa la cantidad
    } else {
      this.carrito.push(producto); // Agrega el producto
    }
  }

  generarXML(): string {
    const IVA_RATE = 0.16; // Tasa del IVA
    const subtotal = this.carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;
    const negocio = 'Papos Valencia';

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<factura>\n';
    xml += `  <negocio>${negocio}</negocio>\n`;
    xml += '  <productos>\n';

    this.carrito.forEach(producto => {
      xml += '    <producto>\n';
      xml += `      <id>${producto.id}</id>\n`;
      xml += `      <nombre>${producto.nombre}</nombre>\n`;
      xml += `      <precio>${producto.precio}</precio>\n`;
      xml += `      <cantidad>${producto.cantidad}</cantidad>\n`;
      xml += '    </producto>\n';
    });

    xml += '  </productos>\n';
    xml += `  <subtotal>${subtotal.toFixed(2)}</subtotal>\n`;
    xml += `  <iva>${iva.toFixed(2)}</iva>\n`;
    xml += `  <total>${total.toFixed(2)}</total>\n`;
    xml += '</factura>';

    return xml;
  }
}