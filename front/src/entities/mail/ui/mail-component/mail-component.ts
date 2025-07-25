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
    if (this.mail() && this.mail()?.processedEmail) {
      return this.#sanatizer.bypassSecurityTrustHtml(this.#createEmailDocument(this.mail().processedEmail));
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
    // Process HTML content to add target="_blank" to all links
    const processedHtmlContent = this.#addTargetBlankToLinks(email.htmlContent || 'Contenu non disponible');

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
            overflow-y: hidden;
            box-sizing: border-box;
            width: 100%;
          }
          </style>
        </head>
        <body>
          ${processedHtmlContent}
          <script>
    window.addEventListener('load', () => {
      const height = document.body.scrollHeight;
      parent.postMessage({ type: 'resize', height }, '*');
      
      // Add click event listeners to all links to ensure they open in new window
      const links = document.querySelectorAll('a[href]');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            e.preventDefault();
            window.open(href, '_blank', 'noopener,noreferrer');
          }
        });
      });
    });
  </script>
        </body>
      </html>
    `;
  }

  #addTargetBlankToLinks(htmlContent: string): string {
    // Use regex to add target="_blank" to all anchor tags that don't already have it
    return htmlContent.replace(/<a\s+([^>]*?)href\s*=\s*["']([^"']+)["']([^>]*?)>/gi, (match, beforeHref, href, afterHref) => {
      // Skip if it's already a mailto or tel link, or if target="_blank" already exists
      if (href.startsWith('mailto:') || href.startsWith('tel:') || match.includes('target="_blank"')) {
        return match;
      }
      // Add target="_blank" and rel="noopener noreferrer" for security
      return `<a ${beforeHref}href="${href}"${afterHref} target="_blank" rel="noopener noreferrer">`;
    });
  }
}
