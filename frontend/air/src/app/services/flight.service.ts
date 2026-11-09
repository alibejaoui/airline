import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FlightBase {
  number: string;
  airline: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  cabin: string;
  price: number;
  seats: number;
  status: string;
  aircraft?: string;
}

export interface Flight extends FlightBase {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FlightQueryParams {
  from?: string;
  to?: string;
  cabin?: string;
  status?: string;
  departureDate?: string;
}

export type CreateFlightDto = FlightBase;

export type UpdateFlightDto = Partial<FlightBase>;

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private readonly apiUrl = `${environment.apiUrl}/api/flights`;

  constructor(private http: HttpClient) {}

  getFlights(params?: FlightQueryParams): Observable<Flight[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          httpParams = httpParams.set(key, value);
        }
      });
    }

    return this.http.get<Flight[]>(this.apiUrl, { params: httpParams });
  }

  getFlightById(id: string): Observable<Flight> {
    return this.http.get<Flight>(`${this.apiUrl}/${id}`);
  }

  createFlight(payload: CreateFlightDto, token: string): Observable<Flight> {
    return this.http.post<Flight>(this.apiUrl, payload, {
      headers: this.buildAuthHeaders(token),
    });
  }

  updateFlight(
    id: string,
    payload: UpdateFlightDto,
    token: string
  ): Observable<Flight> {
    return this.http.put<Flight>(`${this.apiUrl}/${id}`, payload, {
      headers: this.buildAuthHeaders(token),
    });
  }

  deleteFlight(id: string, token: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.buildAuthHeaders(token),
    });
  }

  private buildAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
