import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService, Booking } from '../services/booking.service';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['../app.component.css', './payment.component.css'],
})
export class PaymentComponent implements OnInit {
  booking?: Booking;
  isLangMenuOpen = false;
  isProcessing = false;
  errorMessage?: string;
  successMessage?: string;

  paymentData = {
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'credit_card',
  };

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    public authService: AuthService,
    public languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.token) {
      this.router.navigate(['/connexion'], {
        queryParams: { returnUrl: '/payment' },
      });
      return;
    }

    // Récupérer la réservation depuis le state de navigation, history.state ou sessionStorage
    const navigation = this.router.getCurrentNavigation();
    const bookingFromNavigation = navigation?.extras?.state?.['booking'];

    // Essayer history.state (persiste même après rechargement)
    const bookingFromHistory = (window.history.state && window.history.state.booking)
      ? window.history.state.booking
      : null;

    if (bookingFromNavigation) {
      this.booking = bookingFromNavigation;
      // Sauvegarder dans sessionStorage pour persistance
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingFromNavigation));
    } else if (bookingFromHistory) {
      this.booking = bookingFromHistory;
      // Sauvegarder dans sessionStorage pour persistance
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingFromHistory));
    } else {
      // Essayer depuis sessionStorage
      const pendingBooking = sessionStorage.getItem('pendingBooking');
      if (pendingBooking) {
        try {
          this.booking = JSON.parse(pendingBooking);
        } catch (e) {
          this.errorMessage = 'No booking found. Please start over.';
          setTimeout(() => this.router.navigate(['/reserver']), 2000);
        }
      } else {
        this.errorMessage = 'No booking found. Please start over.';
        setTimeout(() => this.router.navigate(['/reserver']), 2000);
      }
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  getPayButtonText(): string {
    if (this.isProcessing) {
      return 'Processing...';
    }
    if (this.booking) {
      return 'Pay ' + this.formatPrice(this.booking.totalPrice);
    }
    return 'Pay';
  }

  formatDate(dateISO: string): string {
    return new Date(dateISO).toLocaleDateString();
  }

  formatTime(dateISO: string): string {
    return new Date(dateISO).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  }

  processPayment(): void {
    if (!this.booking || !this.booking.id) {
      this.errorMessage = 'Invalid booking. Please try again.';
      return;
    }

    // Validation basique des champs de carte
    if (
      !this.paymentData.cardNumber ||
      !this.paymentData.cardHolder ||
      !this.paymentData.expiryDate ||
      !this.paymentData.cvv
    ) {
      this.errorMessage = 'Please fill in all payment fields.';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = undefined;
    this.successMessage = undefined;

    this.bookingService
      .processPayment(
        this.booking.id,
        this.paymentData.paymentMethod
      )
      .subscribe({
        next: (confirmedBooking) => {
          this.successMessage = 'Payment successful! Your booking is confirmed.';
          sessionStorage.removeItem('pendingBooking');
          this.isProcessing = false;

          // Rediriger vers la page account pour voir la réservation confirmée
          setTimeout(() => {
            this.router.navigate(['/account']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message ||
            'Payment failed. Please try again or use a different payment method.';
          this.isProcessing = false;
        },
      });
  }

  toggleLangMenu(): void {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  setLanguage(lang: 'EN' | 'FR'): void {
    this.languageService.setLanguage(lang);
    this.isLangMenuOpen = false;
  }

  switchLanguage(event: Event): void {
    event.stopPropagation();
    const newLang = this.languageService.currentLang === 'EN' ? 'FR' : 'EN';
    this.languageService.setLanguage(newLang);
    this.isLangMenuOpen = false;
  }
}

