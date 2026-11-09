import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-allersimple',
  templateUrl: './allersimple.component.html',
  styleUrls: ['../../app.component.css', './allersimple.component.css']
})
export class AllerSimpleComponent {
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

  isLangMenuOpen = false;

  constructor(
    public languageService: LanguageService,
    public authService: AuthService,
    public router: Router
  ) {}

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

