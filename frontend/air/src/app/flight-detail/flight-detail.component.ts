import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Flight, FlightService } from '../services/flight.service';
import { LanguageService } from '../services/language.service';
import { BookingService } from '../services/booking.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.component.html',
  styleUrls: ['../app.component.css', './flight-detail.component.css'],
})
export class FlightDetailComponent implements OnInit {
  flight?: Flight;
  isLangMenuOpen = false;
  isLoadingFlight = false;
  flightError?: string;

  seatCount = 1;
  bookingMessage?: string;
  bookingError?: string;
  isBooking = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private flightService: FlightService,
    private bookingService: BookingService,
    public authService: AuthService,
    public languageService: LanguageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.loadFlight(id);
  }

  loadFlight(id: string): void {
    this.isLoadingFlight = true;
    this.flightError = undefined;
    this.flightService.getFlightById(id).subscribe({
      next: (flight) => {
        this.flight = flight;
        this.isLoadingFlight = false;
      },
      error: () => {
        this.flightError = 'We could not find this flight. Please search again.';
        this.isLoadingFlight = false;
      },
    });
  }

  canBook(): boolean {
    return !!this.authService.token;
  }

  bookFlight(): void {
    if (!this.flight) {
      return;
    }

    if (!this.canBook()) {
      // Rediriger vers la connexion avec la route de retour
      const returnUrl = `/flight/${this.flight.id}`;
      this.router.navigate(['/connexion'], { queryParams: { returnUrl } });
      return;
    }

    const seats = Number(this.seatCount);
    if (!Number.isFinite(seats) || seats < 1 || seats > this.flight.seats) {
      this.bookingError = 'Please select a valid number of seats.';
      return;
    }

    this.isBooking = true;
    this.bookingError = undefined;
    this.bookingService
      .createBooking({ flightId: this.flight.id, seats })
      .subscribe({
        next: (booking) => {
          // Sauvegarder la réservation dans sessionStorage
          sessionStorage.setItem('pendingBooking', JSON.stringify(booking));
          this.isBooking = false;
          // Rediriger vers la page de paiement
          this.router.navigate(['/payment'], {
            state: { booking },
          });
        },
        error: (error) => {
          this.bookingError =
            error?.error?.message || 'Unable to complete the booking right now.';
          this.isBooking = false;
        },
      });
  }

  formatTime(dateISO: string): string {
    return new Date(dateISO).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDate(dateISO: string): string {
    return new Date(dateISO).toLocaleDateString();
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
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
