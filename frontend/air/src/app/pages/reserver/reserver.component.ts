import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { FlightService, Flight } from '../../services/flight.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reserver',
  templateUrl: './reserver.component.html',
  styleUrls: ['../../app.component.css', './reserver.component.css']
})
export class ReserverComponent implements OnInit {
  isLangMenuOpen = false;

  // Formulaire de recherche
  searchCriteria = {
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: '1',
    cabin: 'Economy',
    tripType: 'return' // 'return' | 'one-way' | 'multi-city'
  };

  // Résultats
  availableFlights: Flight[] = [];
  selectedFlight: Flight | null = null;
  seatCount = 1;
  isLoadingFlights = false;
  searchPerformed = false;
  flightsError?: string;

  // État de réservation
  isCreatingBooking = false;
  bookingError?: string;
  currentBooking: any = null;

  constructor(
    public languageService: LanguageService,
    private flightService: FlightService,
    private bookingService: BookingService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier s'il y a une réservation en cours depuis la session
    const pendingBooking = sessionStorage.getItem('pendingBooking');
    if (pendingBooking) {
      try {
        const bookingData = JSON.parse(pendingBooking);
        // Si c'est juste les données de vol (pas encore une réservation créée)
        if (bookingData.flight) {
          this.selectedFlight = bookingData.flight;
          this.seatCount = bookingData.seats || 1;
          // Si l'utilisateur est maintenant connecté, créer automatiquement la réservation
          if (this.canBook() && !this.currentBooking) {
            this.bookSeats();
          }
        } else if (bookingData.id) {
          // Si c'est déjà une réservation créée, rediriger vers le paiement
          this.currentBooking = bookingData;
          this.router.navigate(['/payment'], { state: { booking: bookingData } });
        }
      } catch (e) {
        sessionStorage.removeItem('pendingBooking');
      }
    }
  }

  searchFlights(): void {
    if (!this.searchCriteria.from || !this.searchCriteria.to || !this.searchCriteria.departureDate) {
      this.flightsError = 'Please fill in all required fields.';
      return;
    }

    this.isLoadingFlights = true;
    this.flightsError = undefined;
    this.searchPerformed = false;

    const params: any = {
      from: this.searchCriteria.from.trim(),
      to: this.searchCriteria.to.trim(),
      cabin: this.searchCriteria.cabin.trim(),
      departureDate: this.searchCriteria.departureDate,
    };

    this.flightService.getFlights(params).subscribe({
      next: (flights) => {
        this.availableFlights = flights;
        this.isLoadingFlights = false;
        this.searchPerformed = true;
      },
      error: () => {
        this.flightsError = 'Unable to load flights. Please try again.';
        this.isLoadingFlights = false;
        this.searchPerformed = true;
      },
    });
  }

  selectFlight(flight: Flight): void {
    this.selectedFlight = flight;
    this.seatCount = 1;
    this.bookingError = undefined;
  }

  canBook(): boolean {
    return !!this.authService.token && !!this.selectedFlight;
  }

  async bookSeats(): Promise<void> {
    if (!this.selectedFlight) {
      return;
    }

    // Si pas connecté, rediriger vers connexion avec les infos de réservation
    if (!this.canBook()) {
      const bookingData = {
        flight: this.selectedFlight,
        seats: this.seatCount,
        searchCriteria: this.searchCriteria,
      };
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      this.router.navigate(['/connexion'], {
        queryParams: { returnUrl: '/reserver', action: 'book' },
      });
      return;
    }

    const seats = Number(this.seatCount);
    if (!Number.isFinite(seats) || seats < 1 || seats > this.selectedFlight.seats) {
      this.bookingError = 'Please select a valid number of seats.';
      return;
    }

    this.isCreatingBooking = true;
    this.bookingError = undefined;

    this.bookingService
      .createBooking({
        flightId: this.selectedFlight.id,
        seats,
      })
      .subscribe({
        next: (booking) => {
          this.currentBooking = booking;
          sessionStorage.setItem('pendingBooking', JSON.stringify(booking));
          this.isCreatingBooking = false;
          // Rediriger vers la page de paiement
          this.router.navigate(['/payment'], {
            state: { booking },
          });
        },
        error: (error) => {
          this.bookingError =
            error?.error?.message ||
            'Unable to create booking. Please try again.';
          this.isCreatingBooking = false;
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

  formatPrice(price: number): string {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  openConnexion(): void {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/connexion`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
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
