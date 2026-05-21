import { Component, OnInit, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentDetail } from '../shared/payment-detail';
import { finalize, timeout } from 'rxjs';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css',
})
export class PaymentDetails implements OnInit {

  paymentList: any[] = [];
  selectedProduct: any = null;
  showSuccess = false;
  isModalOpen = false;
  isProcessing = false;

  product = [
    { name: 'iPhone 17 Pro', price: '₹1,19,999', image: 'iphone17pro.png' },
    { name: 'iPhone 17', price: '₹80,000', image: 'iphone17.png' },
    { name: 'iPhone 16 Pro', price: '₹1,09,000', image: 'iphone16pro.png' },
    { name: 'iPhone 16', price: '₹60,000', image: 'iphone16.png' },
    { name: 'iPhone 15 Pro', price: '₹85,000', image: 'iphone15pro.png' },
    { name: 'iPhone 15', price: '₹50,000', image: 'iphone15.png' },
  ];

  @ViewChild('cardTrack') cardTrackRef!: ElementRef<HTMLDivElement>;

  constructor(
    public service: PaymentDetail,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { this.refreshData(); }

  buyNow(prod: any) {
    this.selectedProduct = prod;
    this.isModalOpen = true;
  }

  refreshData() {
    this.service.refreshlist().subscribe({
      next: (res: any) => { this.paymentList = [...res]; },
      error: (err) => { console.log(err); }
    });
  }

  trackByProduct(index: number, prod: any): string { return prod.name; }

  payNow() {

    if (this.isProcessing) return;

    console.log('1. Pay button clicked');

    this.isProcessing = true;
    this.cdr.detectChanges();

    this.service.postpayment().subscribe({

      next: (res) => {

        console.log('2. API SUCCESS:', res);

        this.zone.run(() => {

          this.isProcessing = false;
          this.isModalOpen = false;
          this.showSuccess = true;

          this.service.formData = {
            paymentDetailId: 0,
            cardOwnerName: '',
            cardNumber: '',
            expirationDate: '',
            securityCode: ''
          };

          console.log('STATE AFTER SUCCESS:', {
            isProcessing: this.isProcessing,
            isModalOpen: this.isModalOpen,
            showSuccess: this.showSuccess
          });

          this.cdr.detectChanges();

          this.playChime();

          this.refreshData();

          setTimeout(() => {
            this.zone.run(() => {
              this.showSuccess = false;
              this.cdr.detectChanges();
            });
          }, 5000);

        });

      },

      error: (err) => {

        console.log('3. API ERROR:', err);

        this.zone.run(() => {

          this.isProcessing = false;
          this.isModalOpen = false;

          this.cdr.detectChanges();

          alert('Payment failed. Please try again.');

        });

      }

    });
  }
  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    value = value.substring(0, 16);

    value = value.replace(/(.{4})/g, '$1 ').trim();

    this.service.formData.cardNumber = value;

    this.cdr.detectChanges();
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    value = value.substring(0, 4);

    if (value.length >= 3) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }

    this.service.formData.expirationDate = value;

    this.cdr.detectChanges();
  }

  formatCVV(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    value = value.substring(0, 3);

    this.service.formData.securityCode = value;

    this.cdr.detectChanges();
  }

  formatName(event: any) {
    let value = event.target.value.replace(/[^a-zA-Z\s]/g, '');

    this.service.formData.cardOwnerName = value;

    this.cdr.detectChanges();
  }
  spawnConfetti() {
    const overlay = document.querySelector('.success-overlay');
    if (!overlay) return;
    const colors = ['#34c759', '#0071e3', '#ff9f0a', '#ff3b30', '#5856d6'];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div');
      const size = Math.random() * 8 + 4;
      el.className = 'confetti-piece';
      el.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 20 - 10}%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        animation-delay:${Math.random() * 0.5}s;
        animation-duration:${1.5 + Math.random() * 1.5}s;
      `;
      overlay.appendChild(el);
    }
    setTimeout(() => {
      overlay.querySelectorAll('.confetti-piece').forEach(el => el.remove());
    }, 4000);
  }

  playChime() {
    try {
      const ctx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      const notes: [number, number][] = [[523, 0.05], [659, 0.17], [784, 0.29], [1047, 0.41]];
      notes.forEach(([freq, t]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, ctx.currentTime + t);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + t + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + t + 0.25);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.3);
      });
    } catch (e) { }
  }

  closeModal() { this.isModalOpen = false; }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  scrollToCard(i: number) {
    const track = this.cardTrackRef?.nativeElement;
    if (!track) return;
    const w = (track.firstElementChild as HTMLElement)?.offsetWidth ?? 260;
    track.scrollTo({ left: i * (w + 20), behavior: 'smooth' });
  }
}