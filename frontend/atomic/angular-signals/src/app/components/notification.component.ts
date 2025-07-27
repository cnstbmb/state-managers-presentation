import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderQuery, OrderFacade } from '../state';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="notification() as n" class="notification notification-{{n.type}}">
      {{ n.message }}
      <button (click)="close()" class="close-btn">×</button>
    </div>
  `,
  styles: [],
})
export class NotificationComponent {
  private query = inject(OrderQuery);
  notification = this.query.notification;

  constructor(private facade: OrderFacade) {}

  close() {
    this.facade.clearNotification();
  }
}
