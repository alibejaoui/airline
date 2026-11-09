import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['../app.component.css', './join.component.css']
})
export class JoinComponent implements OnInit {
  currentStep = 1;
  totalSteps = 7;
  isLangMenuOpen = false;
  showPassword = false;
  isSubmitting = false;
  errorMessage?: string;
  successMessage?: string;

  // Form data
  formData = {
    // Step 1: Access data
    email: '',
    password: '',
    confirmPassword: '',

    // Step 2: Personal information
    civility: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',

    // Step 3: Contact details
    country: '',
    phoneNumber: '',
    phoneCode: '+216',

    // Step 4: Travel documents
    passportNumber: '',
    cin: '',

    // Step 5: Professional information
    company: '',
    position: '',
    professionalPhone: '',
    professionalPhoneCode: '+216',

    // Step 6: Preferences
    receiveEmails: false,
    receiveSMS: false,
    acceptTerms: false,
    travelPreferences: {
      seatPreference: '',
      mealPreference: '',
      specialAssistance: ''
    },

    // Step 7: Confirmation
    membershipType: 'privilege' // or 'student'
  };

  nationalities = [
    'Tunisia', 'France', 'United States', 'United Kingdom', 'Germany',
    'Italy', 'Spain', 'Canada', 'Morocco', 'Algeria', 'Other'
  ];

  countries = [
    'Tunisia', 'France', 'United States', 'United Kingdom', 'Germany',
    'Italy', 'Spain', 'Canada', 'Morocco', 'Algeria', 'Other'
  ];

  positions = [
    'Manager', 'Engineer', 'Doctor', 'Teacher', 'Student',
    'Business Owner', 'Consultant', 'Other'
  ];

  seatPreferences = ['Window', 'Aisle', 'No preference'];
  mealPreferences = ['Standard', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'No preference'];

  steps = [
    { number: 1, title: 'Données d\'accès', label: 'Access data' },
    { number: 2, title: 'Informations perso', label: 'Personal information' },
    { number: 3, title: 'Coordonnées', label: 'Contact details' },
    { number: 4, title: 'Documents de voyage', label: 'Travel documents' },
    { number: 5, title: 'Informations professionnelles', label: 'Professional information' },
    { number: 6, title: 'Préférences', label: 'Preferences' },
    { number: 7, title: 'Confirmation', label: 'Confirmation' }
  ];

  constructor(
    public languageService: LanguageService,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['membershipType']) {
      this.formData.membershipType = navigation.extras.state['membershipType'];
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.formData.email && !!this.formData.password &&
               this.formData.password === this.formData.confirmPassword &&
               this.isPasswordValid();
      case 2:
        return !!this.formData.civility && !!this.formData.firstName &&
               !!this.formData.lastName && !!this.formData.dateOfBirth &&
               !!this.formData.nationality;
      case 3:
        return !!this.formData.country && !!this.formData.phoneNumber;
      case 4:
        return !!this.formData.passportNumber;
      case 5:
        return true; // Optional fields
      case 6:
        return this.formData.acceptTerms;
      case 7:
        return true;
      default:
        return false;
    }
  }

  isPasswordValid(): boolean {
    const password = this.formData.password;
    if (password.length < 8) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[^a-zA-Z0-9]/.test(password)) return false;
    return true;
  }

  submitForm(): void {
    if (!this.isStepValid(7) || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = undefined;
    this.successMessage = undefined;

    const payload = {
      name: `${this.formData.firstName} ${this.formData.lastName}`.trim(),
      email: this.formData.email,
      password: this.formData.password,
      role: 'user' as const,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.successMessage = 'Welcome aboard! Your Maervia account is ready.';
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ||
          'We were unable to complete your registration. Please try again.';
        this.isSubmitting = false;
      },
    });
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

