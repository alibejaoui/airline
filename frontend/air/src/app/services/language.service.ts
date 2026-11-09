import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<'EN' | 'FR'>('EN');
  currentLang$ = this.currentLangSubject.asObservable();

  get currentLang(): 'EN' | 'FR' {
    return this.currentLangSubject.value;
  }

  setLanguage(lang: 'EN' | 'FR'): void {
    this.currentLangSubject.next(lang);
  }
}


