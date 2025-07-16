import { Routes } from '@angular/router';
import { AuthCallbackComponent } from '../pages/callback/ui/auth-callback-component';
import { HomeComponent } from '../pages/home/ui/home-component';
import { authGuard } from '../shared/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent,
    title: 'Authentication Callback',
  },
  {
    path: 'mails',
    loadComponent: () => import('../pages/mails/ui/mails-component').then(m => m.MailsComponent),
    title: 'Mails',
    canActivate: [authGuard],
  },
  {
    path: 'mails/:mailId',
    loadComponent: () => import('../pages/mail-details/ui/mail-details-component').then(m => m.MailDetailsComponent),
    title: 'Mail Details',
    canActivate: [authGuard],
  },
  {
    path: 'agenda',
    loadComponent: () => import('../pages/agenda/ui/agenda-component').then(m => m.AgendaComponent),
    title: 'Agenda',
    canActivate: [authGuard],
  },
];
