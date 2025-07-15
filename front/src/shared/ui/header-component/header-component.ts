import { Component, computed, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  readonly #router = inject(Router);
  #title = signal('');

  // Map route paths to titles
  #routeTitleMap: Record<string, string> = {
    '': 'HOME',
    agenda: 'AGENDA',
    mails: 'MAILS',
    'mails/:mailId': 'MAIL DETAILS',
    'auth/callback': 'AUTH CALLBACK',
  };

  constructor() {
    this.#router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects.split('?')[0].replace(/^\//, '');
        // Find the best match for the route
        let title = this.#routeTitleMap[url] || '';
        // Handle dynamic routes like mails/:mailId
        if (!title && url.startsWith('mails/')) {
          title = this.#routeTitleMap['mails/:mailId'];
        }
        this.#title.set(title || '');
      }
    });
  }

  title = computed(() => this.#title());
}
