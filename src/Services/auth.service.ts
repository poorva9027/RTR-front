// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../Environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 private apiUrl = `${environment.apiBaseUrl}/${environment.endpoints.auth}`;
  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('fullName', res.fullName);
      })
    );
  }

  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        console.log('Registration response:', response);  
      }),
      catchError((error) => {
        console.error('Registration failed:', error);  
        return throwError(() => new Error(error.error?.message || 'Registration failed'));  
      })
    );
  }
  
  getFullName(): string {
    return localStorage.getItem('fullName') || '';
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean { 
    return !!this.getToken();
  }
}
