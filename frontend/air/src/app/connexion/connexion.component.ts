import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['../app.component.css', './connexion.component.css'],
})
export class ConnexionComponent {
  loginData = {
    email: '',
    password: '',
  };

  isLangMenuOpen = false;
  isSubmitting = false;
  errorMessage?: string;
  successMessage?: string;

  constructor(
    public languageService: LanguageService,
    public authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  openConnexion(): void {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/connexion`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  submit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = undefined;
    this.successMessage = undefined;

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.successMessage = 'Welcome back! You are now signed in.';
        this.isSubmitting = false;
        // Vérifier s'il y a une réservation en attente
        const pendingBooking = sessionStorage.getItem('pendingBooking');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        const action = this.route.snapshot.queryParams['action'];

        // Si on vient de reserver et qu'on a une réservation en attente, continuer le processus
        if (returnUrl === '/reserver' && action === 'book' && pendingBooking) {
          // Rediriger vers reserver qui va automatiquement créer la réservation
          setTimeout(() => {
            this.router.navigate([returnUrl]);
          }, 1000);
        } else {
          this.router.navigate([returnUrl]);
        }
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'We could not sign you in. Please try again.';
        this.isSubmitting = false;
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
