import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  private readonly tokenStorageKey = 'maervia_token';
  private readonly userStorageKey = 'maervia_user';

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(
    this.getStoredUser()
  );

  constructor(private http: HttpClient) {}

  get currentUser$(): Observable<AuthUser | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.tokenStorageKey);
  }

  login(credentials: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap((response) => this.persistSession(response)));
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(tap((response) => this.persistSession(response)));
  }

  logout(): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.userStorageKey);
    this.currentUserSubject.next(null);
  }

  buildAuthHeaders(): HttpHeaders {
    const token = this.token;
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private persistSession(response: AuthResponse): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(this.tokenStorageKey, response.token);
    localStorage.setItem(this.userStorageKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(this.userStorageKey);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }
}

