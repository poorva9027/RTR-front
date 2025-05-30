import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordValidationService {
  validatePassword(password: string): boolean {
    if (!password) return false;

    if (password.length < 8) return false;

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    return hasLowercase && hasUppercase && hasNumber && hasSpecialChar;
  }
}
