import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthUser } from '../services/auth.service';
import { BookingService, Booking } from '../services/booking.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['../app.component.css', './account.component.css'],
})
export class AccountComponent implements OnInit {
  user: AuthUser | null = null;
  bookings: Booking[] = [];
  isLoadingBookings = false;
  bookingsError?: string;
  isLangMenuOpen = false;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    public languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    this.user = this.authService.currentUser;
    if (!this.user) {
      this.router.navigate(['/connexion'], {
        queryParams: { returnUrl: '/account' },
      });
      return;
    }

    // Charger les réservations
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoadingBookings = true;
    this.bookingsError = undefined;

    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        // Trier par date de création (plus récentes en premier)
        this.bookings = bookings.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        this.isLoadingBookings = false;
      },
      error: (error) => {
        this.bookingsError =
          error?.error?.message || 'Unable to load your bookings.';
        this.isLoadingBookings = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  formatDate(dateISO: string): string {
    return new Date(dateISO).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  formatPrice(price: number): string {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed':
        return '#22c55e';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#64748b';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending Payment';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  }

  cancelBooking(booking: Booking): void {
    if (
      !confirm(
        'Are you sure you want to cancel this booking? This action cannot be undone.'
      )
    ) {
      return;
    }

    this.bookingService.deleteBooking(booking.id).subscribe({
      next: () => {
        // Recharger la liste après annulation
        this.loadBookings();
      },
      error: (error) => {
        alert(
          error?.error?.message || 'Unable to cancel booking. Please try again.'
        );
      },
    });
  }

  goToPayment(booking: Booking): void {
    // Sauvegarder la réservation dans sessionStorage pour persistance
    sessionStorage.setItem('pendingBooking', JSON.stringify(booking));
    this.router.navigate(['/payment'], {
      state: { booking },
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

