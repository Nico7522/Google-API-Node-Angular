import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorComponent } from '../shared/ui/error-component/error-component';
import { ErrorService } from '../shared/models/error/error-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'front';
}
