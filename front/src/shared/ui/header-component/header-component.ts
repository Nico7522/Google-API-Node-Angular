import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header-component',
  imports: [RouterModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  readonly #router = inject(Router);
  readonly #navigationEnd = toSignal(this.#router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)), {
    initialValue: new NavigationEnd(0, this.#router.url, this.#router.url),
  });
  title = computed(() => (this.#navigationEnd().url === '/' ? 'Home' : this.#getPageTitle(this.#navigationEnd().url)));

  #getPageTitle(url: string) {
    let title = '';
    switch (url) {
      case '/mails':
        title = 'Mails';
        break;
      case '/agenda':
        title = 'Agenda';
        break;
      default:
        title = 'Mails';
        break;
    }

    return title;
  }
}
