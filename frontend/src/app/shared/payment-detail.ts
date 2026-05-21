// src/app/shared/payment-detail.ts
// Removed NgZone — no longer needed since withFetch() is removed from app.config.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentDetail {

  url: string = environment.apibaseurl + '/PaymentDetails';

  formData: any = {
    paymentDetailId: 0,
    cardOwnerName: '',
    cardNumber: '',
    expirationDate: '',
    securityCode: ''
  };

  constructor(private http: HttpClient) {}  // ← removed NgZone

  refreshlist(): Observable<any> {
    return this.http.get(this.url);
  }

  postpayment(): Observable<any> {
    return this.http.post(this.url, this.formData);  // ← back to simple one-liner
  }
}