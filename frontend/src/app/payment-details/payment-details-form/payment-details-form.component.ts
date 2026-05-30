// payment-details-form.component.ts
import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentDetail } from '../../shared/payment-detail';

@Component({
  selector: 'app-payment-details-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-details-form.component.html',
  styleUrl: './payment-details-form.component.css'
})
export class PaymentDetailsForm {

  isProcessing = false;
  showSuccess  = false;

  constructor(public service: PaymentDetail, private zone: NgZone) {}

  payNow(payForm?: any)
   
  {
      if (payForm.invalid) {
    Object.values(payForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
    return;
  }
  else{
    this.isProcessing = true;

    this.service.postpayment().subscribe({
      next: () => {
        this.zone.run(() => {
          this.isProcessing = false;
          this.showSuccess  = true;

          this.service.formData = {
            paymentDetailId: 0,
            cardOwnerName:   '',
            cardNumber:      '',
            expirationDate:  '',
            securityCode:    ''
          };

          setTimeout(() => {
            this.zone.run(() => { this.showSuccess = false; });
          }, 3000);
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.isProcessing = false;
          alert('Payment failed.');
        });
      }
    });
  }
}
}