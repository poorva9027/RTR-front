import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { EmailValidationService } from '../../Validation/email-validation.service';
import { PasswordValidationService } from '../../Validation/password-validation.service';
import { OnlyLettersValidationService } from '../../Validation/only-letters-validation.service';
import { LogService } from '../../../Services/log.service';

@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    EmailValidationService,
    PasswordValidationService,
    OnlyLettersValidationService,
    AuthService,
  ],
})
export class LoginpageComponent implements OnInit {
  closeAlert() {
    this.Invalid = false;
    this.UserExist = false;
    this.Success = false;
  }
  SignUp: boolean = false;
  SignIn: boolean = true;
  signInForm: FormGroup;
  signUpForm: FormGroup;
  @Output() formValidChange = new EventEmitter<boolean>();
  submitted = false;
  Success: boolean = false;
  Invalid: boolean = false;
  UserExist: boolean = false;

  // Password visibility toggles
  showSignInPassword: boolean = false;
  showSignUpPassword: boolean = false;
  showSignUpConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private emailValidationService: EmailValidationService,
    private passwordValidationService: PasswordValidationService,
    private onlyLettersValidationService: OnlyLettersValidationService,
    private authService: AuthService,
    private router: Router,
    private logService: LogService
  ) {
    // Use the custom email validator for the sign in form
    this.signInForm = this.fb.group({
      username: ['', [Validators.required, this.emailDomainValidator()]],
      password: ['', Validators.required],
    });

    this.signUpForm = this.fb.group(
      {
        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            this.onlyLettersValidator(),
            this.trimStartValidator(),
          ],
        ],
        username: ['', [Validators.required, this.emailDomainValidator()]],
        password: ['', [Validators.required, this.passwordValidator()]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.checkPasswords(),
      }
    );
  }

  // Toggle password visibility functions
  toggleSignInPasswordVisibility() {
    this.showSignInPassword = !this.showSignInPassword;
  }

  toggleSignUpPasswordVisibility() {
    this.showSignUpPassword = !this.showSignUpPassword;
  }

  toggleSignUpConfirmPasswordVisibility() {
    this.showSignUpConfirmPassword = !this.showSignUpConfirmPassword;
  }

  emailDomainValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email = control.value;
      if (!email) return null;

      // Make sure the email validation service is actually validating properly
      const isValid = this.emailValidationService.validateEmailDomain(email);
      console.log(
        'Email validation for',
        email,
        ':',
        isValid ? 'valid' : 'invalid'
      );
      return isValid ? null : { invalidEmail: true };
    };
  }

  onlyLettersValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) return null;

      const isValid =
        this.onlyLettersValidationService.validateOnlyLetters(value);
      return isValid ? null : { onlyLetters: true };
    };
  }

  trimStartValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value && control.value.trimStart() !== control.value
        ? { trimStart: true }
        : null;
    };
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.value;
      if (!password) return { requiredPassword: true };

      const isValid = this.passwordValidationService.validatePassword(password);
      return isValid ? null : { invalidPassword: true };
    };
  }

  checkPasswords(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const pass = group.get('password')?.value;
      const confirmPass = group.get('confirmPassword')?.value;

      return pass === confirmPass ? null : { passwordMismatch: true };
    };
  }

  onSignIn() {
    this.submitted = true;
    
    // Log the form state to debug
    console.log('Sign In Form Valid:', this.signInForm.valid);
    this.logService.log('Navbar initialized');
    console.log('Username errors:', this.signInForm.get('username')?.errors);

    if (this.signInForm.valid) {
      const { username, password } = this.signInForm.value;
      this.authService.login({ username, password }).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          console.error('Login error:', err);
          this.Invalid = true;
          setTimeout(() => {
            this.Invalid = false;
          }, 4000);
        },
      });
    } else {
      console.log('Form Invalid');
      // Force validation to show errors
      Object.keys(this.signInForm.controls).forEach((key) => {
        const control = this.signInForm.get(key);
        control?.markAsDirty();
        control?.markAsTouched();
      });

      this.Invalid = true;
      setTimeout(() => {
        this.Invalid = false;
      }, 4000);
    }
  }

  onSignUp() {
    this.submitted = true;

    if (this.signUpForm.invalid) {
      console.log('Sign Up form is invalid');
      // Force validation to show errors
      Object.keys(this.signUpForm.controls).forEach((key) => {
        const control = this.signUpForm.get(key);
        control?.markAsDirty();
        control?.markAsTouched();
      });
      return;
    }

    const userData = {
      fullName: this.signUpForm.value.fullName,
      username: this.signUpForm.value.username,
      password: this.signUpForm.value.password,
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.Success = true;
        this.SignIn = true;
        this.SignUp = false;
        this.signUpForm.reset();
        this.signInForm.reset();
        this.submitted = false;

        setTimeout(() => {
          this.Success = false;
        }, 4000);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.UserExist = true;
        setTimeout(() => {
          this.UserExist = false;
        }, 4000);
      },
    });
  }

  signin() {
    this.SignIn = false;
    this.SignUp = true;
  }

  signup() {
    this.SignIn = true;
    this.SignUp = false;
  }

  ngOnInit() {}

  getErrorMessage(controlName: string): string {
    const control = this.signInForm.get(controlName);

    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('invalidEmail')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('requiredPassword')) {
      return 'Password is required';
    }

    return '';
  }

  getErrorMessage2(controlName: string): string {
    const control = this.signUpForm.get(controlName);

    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('invalidEmail')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('requiredPassword')) {
      return 'Password is required';
    }
    if (control?.hasError('invalidPassword')) {
      return 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character';
    }
    if (control?.hasError('minlength') && controlName === 'fullName') {
      return 'Full name must be at least 3 characters long';
    }
    if (control?.hasError('onlyLetters') && controlName === 'fullName') {
      return 'Full name must contain only letters';
    }
    if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    if (control?.hasError('trimStart')) {
      return 'Full Name cannot start with a space';
    }
    return '';
  }
}
