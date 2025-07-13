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
  {
    path: 'mails',
    loadComponent: () =>
      import('../pages/mails/ui/mails-component').then((m) => m.MailsComponent),
  },
  {
    path: 'mails/:mailId',
    loadComponent: () =>
      import('../pages/mail-details/ui/mail-details-component').then(
        (m) => m.MailDetailsComponent
      ),
  },
];
