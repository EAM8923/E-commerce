import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private apiUrl = 'https://api-m.sandbox.paypal.com/v2/checkout/orders'; // Sandbox para pruebas

  constructor(private http: HttpClient) {}

  createOrder(amount: number): Observable<any> {
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toFixed(2)
        }
      }]
    };

    return this.http.post(this.apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
        // El SDK de PayPal en index.html manejará la autenticación con el Client ID
      }
    }).pipe(
      catchError(err => {
        console.error('Error en createOrder:', err);
        return throwError(() => new Error('Error al crear la orden'));
      })
    );
  }

  captureOrder(orderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${orderId}/capture`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(err => {
        console.error('Error en captureOrder:', err);
        return throwError(() => new Error('Error al capturar la orden'));
      })
    );
  }
}