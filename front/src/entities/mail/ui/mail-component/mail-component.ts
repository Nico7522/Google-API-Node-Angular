import { AfterViewInit, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail, ProcessedEmail } from '../../models/interfaces/mail-interface';
import { RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToFrenchDatePipe } from '../../../../shared/ui/pipes/to-french-date-pipe';

@Component({
  selector: 'app-mail-component',
  imports: [CommonModule, ToFrenchDatePipe, RouterModule],
  templateUrl: './mail-component.html',
  styleUrls: ['./mail-component.scss'],
})
export class MailComponent implements AfterViewInit {
  readonly #sanatizer = inject(DomSanitizer);

  mail = input.required<Mail>();
  processedEmail = computed(() => {
    if (this.mail() && this.mail()?.processedEmail.hasStyles) {
      return this.#sanatizer.bypassSecurityTrustHtml(this.#createEmailDocument(this.mail()!.processedEmail));
    }
    return null;
  });

  ngAfterViewInit(): void {
    window.addEventListener('message', event => {
      if (event.data?.type === 'resize') {
        const iframe = document.getElementById('emailFrame') as HTMLIFrameElement;
        if (iframe) {
          iframe.style.height = event.data.height + 'px';
        }
      }
    });
  }

  #createEmailDocument(email: ProcessedEmail): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            ${email.cssStyles || ''}
            html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            box-sizing: border-box;
            width: 100%;
          }
          </style>
        </head>
        <body>
          ${email.htmlContent || 'Contenu non disponible'}
          <script>
    window.addEventListener('load', () => {
      const height = document.body.scrollHeight;
      parent.postMessage({ type: 'resize', height }, '*');
    });
  </script>
        </body>
      </html>
    `;
  }
}
