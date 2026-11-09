import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['../../app.component.css', './help.component.css']
})
export class HelpComponent {
  isLangMenuOpen = false;

  helpTopics = [
    {
      id: 'refund',
      title: 'Remboursement & bon de voyage',
      titleEn: 'Refund & Travel Voucher',
      description: 'Demandez un remboursement ou obtenez le montant sous forme de bon d\'achat',
      descriptionEn: 'Request a refund or get the amount as a purchase voucher',
      icon: '🎫'
    },
    {
      id: 'name',
      title: 'Modification du nom',
      titleEn: 'Name Modification',
      description: 'Demander la modification du nom d\'un passager avec une réservation',
      descriptionEn: 'Request the modification of a passenger\'s name with a reservation',
      icon: '✏️'
    },
    {
      id: 'comments',
      title: 'Commentaires',
      titleEn: 'Comments',
      description: 'Envoyez-nous vos remerciements ou réclamations',
      descriptionEn: 'Send us your thanks or complaints',
      icon: '👍'
    },
    {
      id: 'modification',
      title: 'Modification du vol',
      titleEn: 'Flight Modification',
      description: 'Mettre à jour ou modifier votre voyage',
      descriptionEn: 'Update or modify your trip',
      icon: '📅'
    }
  ];


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
