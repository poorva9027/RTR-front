import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../Environments/environments';

@Injectable({
  providedIn: 'root',
})
export class RetirementFormService {
  private baseUrl = environment.apiBaseUrl;
  private goalEndpoint = environment.endpoints.retirementGoal;
  private monthlyEndpoint = environment.endpoints.monthlySavings;

  saveGoal(formData: any) {
    throw new Error('Method not implemented.');
  }
  private formDataSource = new BehaviorSubject<any>(null);
  formData$ = this.formDataSource.asObservable();

  updateFormData(data: any) {
    this.formDataSource.next(data);
  }

  constructor(private http: HttpClient) {}

  saveRetirementGoal(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.goalEndpoint}`, payload);
  }

  calculateMonthly(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.monthlyEndpoint}`, payload);
  }

  getRetirementGoalById(goalId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${this.goalEndpoint}/${goalId}`);
  }

  updateRetirementGoal(goalId: string, payload: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${this.goalEndpoint}/${goalId}`,
      payload
    );
  }

  sendEmail(emailData: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${this.goalEndpoint}/send-email`,
      emailData
    );
  }
}
