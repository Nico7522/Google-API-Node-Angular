import { Routes } from '@angular/router';
import { AuthCallbackComponent } from '../pages/callback/ui/auth-callback-component';
import { HomeComponent } from '../pages/home/ui/home-component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent,
  },
];
