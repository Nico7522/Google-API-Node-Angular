import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorComponent } from '../shared/ui/error-component/error-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'front';
}
