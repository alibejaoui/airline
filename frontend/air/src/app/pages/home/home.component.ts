import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightService, Flight } from '../../services/flight.service';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../app.component.css', './home.component.css'],
})
export class HomeComponent implements OnInit {
  destinations = [
    {
      country: 'France',
      city: 'Paris',
      price: '€299',
      image:
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80'
    },
    {
      country: 'United States',
      city: 'New York',
      price: '$499',
      image:
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=900&q=80'
    },
    {
      country: 'Japan',
      city: 'Tokyo',
      price: '¥649',
      image:
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=900&q=80'
    },
    {
      country: 'United Arab Emirates',
      city: 'Dubai',
      price: 'AED 1,450',
      image:
        'https://images.unsplash.com/photo-1465414829459-d228b58caf6e?auto=format&fit=crop&w=900&q=80'
    },
    {
      country: 'United Kingdom',
      city: 'London',
      price: '£199',
      image:
        'https://images.unsplash.com/photo-1473951574080-01fe45ec8643?auto=format&fit=crop&w=900&q=80'
    }
  ];

  searchCriteria = {
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: '1',
    cabin: 'Economy'
  };

  availableFlights: Flight[] = [];

  searchResults: Flight[] = [];
  searchPerformed = false;

  isLangMenuOpen = false;
  isLoadingFlights = false;
  flightsError?: string;

  constructor(
    private flightService: FlightService,
    public languageService: LanguageService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights(): void {
    this.fetchFlights();
  }

  private fetchFlights(params?: {
    from?: string;
    to?: string;
    cabin?: string;
    departureDate?: string;
  }): void {
    this.isLoadingFlights = true;
    this.flightsError = undefined;
    this.flightService.getFlights(params).subscribe({
      next: (flights) => {
        if (!params) {
          this.availableFlights = flights;
        }
        this.searchResults = flights;
        this.isLoadingFlights = false;
        this.searchPerformed = !!params;
      },
      error: () => {
        this.flightsError =
          'Unable to load flights from the server. Please try again later.';
        this.isLoadingFlights = false;
      },
    });
  }

  searchFlights(): void {
    const params = {
      from: this.searchCriteria.from.trim(),
      to: this.searchCriteria.to.trim(),
      cabin: this.searchCriteria.cabin.trim(),
      departureDate: this.searchCriteria.departureDate,
    };

    this.fetchFlights(params);
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
