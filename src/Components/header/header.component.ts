import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Images } from '../../app/Config/images';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [FormsModule, TranslateModule, CommonModule,RouterModule],
})
export class HeaderComponent {
  logo = Images.logo;
  logoWord = Images.logoWord;
  LogoutSvg = Images.Logout;
  Dashboard = Images.Dashboard;
  List=Images.List;

  profile() {
    this.dropDown = !this.dropDown;
    setTimeout(() => {
      this.dropDown = false;
    }, 10000);
  }
  dropDown: boolean = false;
  mobileMenuOpen = false;
  fullName: string = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.fullName = this.authService.getFullName();
    translate.setDefaultLang(this.selectedLang);
    translate.use(this.selectedLang);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  selectedLang: string = 'en'; // Default language
  supportedLangs = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: 'Chinese' },
    { code: 'fr', label: 'French' },
    { code: 'kn', label: 'Kannada' },
    { code: 'es', label: 'Spanish' },
    { code: 'ta', label: 'Tamil' },
    { code: 'hi', label: 'Hindi' },
  ];

  switchLang(lang: string) {
    this.selectedLang = lang;
    this.translate.use(lang);
  }
}
