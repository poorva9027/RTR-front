import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginpageComponent } from './Pages/login/login.component';
import { AuthGuard } from '../Services/auth.guard';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { RuleComponent } from './Pages/rule/rule.component';
import { AboutUsComponent } from './Pages/about-us/about-us.component';

export const routes: Routes = [
    
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'retirement-rule', component: RuleComponent, canActivate: [AuthGuard] },
    { path: 'about-us', component: AboutUsComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginpageComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    
  })
  
  export class AppRoutingModule { }