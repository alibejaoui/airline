import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['../../app.component.css', './explorer.component.css']
})
export class ExplorerComponent {
  highlights = [
    {
      title: 'Iconic stopovers',
      description: 'Paris, Tokyo, New York, and 50 more handpicked world capitals.'
    },
    {
      title: '24/7 concierge',
      description: 'A Maervia specialist guides every moment of your journey.'
    },
    {
      title: 'Private experiences',
      description: 'Signature lounges, chauffeured transfers, and bespoke itineraries.'
    }
  ];

  stories = [
    {
      destination: 'Nordic horizon by balloon',
      detail: 'Float above Norway’s fjords as the sun rises on the Arctic.'
    },
    {
      destination: 'Yucatan cenote circuit',
      detail: 'Guided underground explorations followed by a Michelin-star dinner.'
    },
    {
      destination: 'Silk Road odyssey',
      detail: 'A multi-city business-class escape from Istanbul to Samarkand.'
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
