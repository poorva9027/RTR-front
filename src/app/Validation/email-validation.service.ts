import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailValidationService {
    private readonly defaultAllowedDomains: string[] = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

  validateEmailDomain(email: string, allowedDomains: string[] = this.defaultAllowedDomains): boolean {
    if (!email) return false;


    const domain = email.split('@')[1].toLowerCase();
    return allowedDomains.includes(domain);
  }

   isEmailFormatValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
