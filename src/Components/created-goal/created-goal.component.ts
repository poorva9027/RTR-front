import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EMAIL_CONFIG } from '../../app/Config/email-valid';
import { RetirementFormService } from '../../Services/retirement-form.service';

@Component({
  selector: 'app-created-goal',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './created-goal.component.html',
  styleUrls: ['./created-goal.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreatedGoalComponent {
  @Input() goal: boolean = true;
  @Input() data: string = '';

  userEmail: string = '';
  emailErrorMessage: string = '';
  sentAlert: boolean = false;
  failAlert: boolean = false;
  isSending: boolean = false;

  constructor(private dataService: RetirementFormService,) {}

  /**
   * Closes the dialog/reset state
   */
  close(): void {
    this.goal = false;
    this.userEmail = '';
    this.emailErrorMessage = '';
    this.sentAlert = false;
    this.failAlert = false;
    this.isSending = false;
  }

  /**
   * Validates the entered email format
   */
  validateEmail(): void {
    const emailRegex = EMAIL_CONFIG.emailRegex
    this.emailErrorMessage = 
      this.userEmail && !emailRegex.test(this.userEmail)
        ? 'Please enter a valid Email address.'
        : '';
  }

  /**
   * Sends an email via backend API
   */
  sendEmail(): void {
    // Don't send if email is invalid
    if (!this.userEmail || this.emailErrorMessage) return;

    this.isSending = true;
    this.sentAlert = false;
    this.failAlert = false;

    const emailData = {
      email: this.userEmail,
      referenceId: this.data
    };

    this.dataService.sendEmail(emailData)
      .subscribe({
        next: (response) => {
          console.log('Email sent successfully:', response);
          this.sentAlert = true;
          this.isSending = false;
        },
        error: (error) => {
          console.error('Error sending email:', error);
          this.failAlert = true;
          this.isSending = false;
        }
      }); 
  }
}
