import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { PaymentDetails } from './payment-details/payment-details.component';
// import { PaymentDetailsForm } from './payment-details/payment-details-form/payment-details-form.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PaymentDetails], // 👈 HttpClientModule removed
  templateUrl: './app.html',
  styles: [],
})
export class App {
  protected readonly title = signal('PaymentApp');
}