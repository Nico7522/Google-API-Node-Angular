import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AiChatService } from '../../api/ai-chat/ai-chat-service';

@Component({
  selector: 'app-ai-chat-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './ai-chat-component.html',
  styleUrl: './ai-chat-component.scss',
})
export class AiChatComponent {
  readonly #aiChatService = inject(AiChatService);
  dialog = signal('');
  closeDialog = output<void>();
  sendMessage() {
    this.#aiChatService.setUserPrompt(this.dialog());
  }

  closeChat() {
    this.closeDialog.emit();
  }
}
