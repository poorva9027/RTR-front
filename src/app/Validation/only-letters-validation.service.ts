import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OnlyLettersValidationService {
  validateOnlyLetters(value: string): boolean {
    if (!value) return true; 
    return /^[a-zA-Z\s]+$/.test(value);
  }
}
