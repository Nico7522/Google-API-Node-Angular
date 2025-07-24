import { Component, input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loading-component',
  templateUrl: './loading-component.html',
  styleUrl: './loading-component.scss',
})
export class LoadingComponent implements OnInit, OnDestroy {
  message = input<string>('');

  ngOnInit(): void {
    // Disable scroll when component initializes
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // Re-enable scroll when component is destroyed
    document.body.style.overflow = 'auto';
  }
}
