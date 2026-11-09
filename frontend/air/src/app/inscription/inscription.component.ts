import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['../app.component.css', './inscription.component.css']
})
export class InscriptionComponent {
  privilegeClubBenefits = [
    'Earn Avios on every booking',
    'Save with Cash + Avios combinations',
    'Complete your reservations faster'
  ];

  studentClubBenefits = [
    'Extra baggage allowance',
    'Exclusive fares on every route',
    'Complimentary Wi-Fi on board'
  ];

  isLangMenuOpen = false;

  constructor(
    public languageService: LanguageService,
    public router: Router,
    public authService: AuthService
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

  navigateToJoin(membershipType: 'privilege' | 'student'): void {
    this.router.navigate(['/join'], {
      state: { membershipType }
    });
  }
}

