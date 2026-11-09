import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['../../app.component.css', './club.component.css']
})
export class ClubComponent implements OnInit, OnDestroy {
  heroSlides = [
    {
      eyebrow: 'Privilege Club',
      headline: 'Maervia Airways Privilege Club',
      description: 'This is The Life. Earn rewards while our crews care for every detail.',
      image: 'https://images.unsplash.com/photo-1649019182102-dea1e156d94f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGNlbGVicmF0aW5nJTIwY2hhbXBhZ25lJTIwbHV4dXJ5fGVufDF8fHx8MTc2MzY0OTEwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      primaryCta: 'Explore the club',
      secondaryCta: 'View tiers'
    },
    {
      eyebrow: 'Cabin experience',
      headline: 'Signature service in the sky',
      description: 'From lounge to First Suite, our crew anticipates every comfort.',
      image: 'https://images.unsplash.com/photo-1625513123245-fcb02d69ad12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBmaXJzdCUyMGNsYXNzJTIwbHV4dXJ5JTIwYWlycGxhbmV8ZW58MXx8fHwxNzYzNjQ5Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      primaryCta: 'Enjoy our lounges',
      secondaryCta: 'Book a flight'
    },
    {
      eyebrow: 'Lifestyle rewards',
      headline: 'Rewards at every stopover',
      description: 'Turn premium stays into Avios with our hotel and lifestyle partners.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80',
      primaryCta: 'Earn Avios',
      secondaryCta: 'Link my accounts'
    }
  ];

  activeSlide = 0;
  private slideInterval?: ReturnType<typeof setInterval>;
  isLangMenuOpen = false;

  constructor(
    public languageService: LanguageService,
    public authService: AuthService,
    public router: Router
  ) {}

  rewardsCards = [
    {
      title: 'Collect Avios',
      description: 'Earn Avios with Qatar Airways, and our oneworld® and partner airlines.'
    },
    {
      title: 'Discover partners',
      description: 'Collect and spend Avios with our growing number of partners worldwide.'


    },
    {
      title: 'Move up tiers',
      description: 'Collect Qpoints when you fly to upgrade your tier and enjoy more benefits.'
    }
  ];

  discoverCards = [
    {
      title: 'All about Avios',
      image: 'https://images.unsplash.com/photo-1567769570190-5a8299488384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXAlMjBwYXNzZW5nZXIlMjBsdXh1cnl8ZW58MXx8fHwxNzYzNjQ4MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'How to earn Avios',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'How to spend Avios',
      image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'What are Qpoints',
      image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=900&q=80'
    }
  ];

  moreWays = [
    {
      title: 'Book with Cash + Avios',
      description: 'Mix points and cash for total flexibility on every booking.',
      image: 'https://images.unsplash.com/photo-1481401027419-4bc1dd16d58e?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Discover Privilege Club Pro',
      description: 'Strategic support designed for frequent flyers.',
      image: 'https://images.unsplash.com/photo-1575985977334-ca65c2d8941a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZXhjbHVzaXZlJTIwbWVtYmVyc2hpcCUyMGNsdWJ8ZW58MXx8fHwxNzYzNjUxNDkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'Explore account linking',
      description: 'Link partner accounts to accelerate how you earn.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Our lounges worldwide',
      description: 'Step into signature lounges across our global hubs.',
      image: 'https://images.unsplash.com/photo-1544367945-4125eb396314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXAlMjBhaXJwb3J0JTIwbG91bmdlJTIwbHV4dXJ5fGVufDF8fHx8MTc2MzY1MTI5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  loveThese = [
    {
      title: 'Claim missing Avios',
      description: 'Redeem points for previous journeys in just a few minutes.',
      icon: '⌁'
    },
    {
      title: 'Find an award seat',
      description: 'Check real-time availability for your preferred awards.',
      icon: '✈'
    },
    {
      title: 'My Calculator',
      description: 'Estimate your Avios and Qpoint potential for every plan.',
      icon: '⌗'
    },
    {
      title: 'Buy, Gift or Transfer Avios',
      description: 'Share your benefits or top up your balance anytime.',
      icon: 'Ⓑ'
    }
  ];

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  get currentSlide() {
    return this.heroSlides[this.activeSlide];
  }

  goToSlide(index: number): void {
    this.activeSlide = index;
    this.restartAutoplay();
  }

  private startAutoplay(): void {
    this.slideInterval = setInterval(() => {
      this.activeSlide = (this.activeSlide + 1) % this.heroSlides.length;
    }, 6000);
  }

  private stopAutoplay(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
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

