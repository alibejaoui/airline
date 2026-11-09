import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Flight } from './flight.service';

export interface Booking {
  id: string;
  flight: Flight;
  user: {
    id: string;
    name: string;
    email: string;
  };
  seats: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt?: string;
}

export interface CreateBookingDto {
  flightId: string;
  seats: number;
}

export interface UpdateBookingDto {
  seats?: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly apiUrl = `${environment.apiUrl}/api/bookings`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl, {
      headers: this.authService.buildAuthHeaders(),
    });
  }

  createBooking(payload: CreateBookingDto): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, payload, {
      headers: this.authService.buildAuthHeaders(),
    });
  }

  updateBooking(id: string, payload: UpdateBookingDto): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, payload, {
      headers: this.authService.buildAuthHeaders(),
    });
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.buildAuthHeaders(),
    });
  }

  processPayment(bookingId: string, paymentMethod: string): Observable<Booking> {
    return this.http.post<Booking>(
      `${this.apiUrl}/${bookingId}/payment`,
      { paymentMethod },
      {
        headers: this.authService.buildAuthHeaders(),
      }
    );
  }
}

