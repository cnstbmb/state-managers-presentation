import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderFacade, OrderQuery } from '../state';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="order$ | async as order; else empty" class="order-details">
      <div class="order-header">
        <h2>Заказ #{{order.id}}</h2>
        <button (click)="facade.toggleFavorite(order.id)" class="favorite-btn" [class.active]="facade.isFavorite(order.id)">
          {{ facade.isFavorite(order.id) ? '★' : '☆' }} Избранное
        </button>
      </div>

      <div class="order-info">
        <p><strong>Клиент:</strong> {{order.customer}}</p>
        <p><strong>Адрес:</strong> {{order.address}}</p>
        <p><strong>Трек-номер:</strong> {{order.trackingNumber}}</p>
        <p><strong>Статус:</strong> <span class="status status-{{order.status}}">{{order.status}}</span></p>
      </div>

      <div class="order-progress">
        <h3>Прогресс доставки</h3>
        <div class="progress-steps">
          <div *ngFor="let step of order.steps" class="step" [class.completed]="step.completed">
            <div class="step-marker"></div>
            <div class="step-info">
              <div class="step-status">{{ step.status }}</div>
              <div class="step-time" *ngIf="step.time">{{ step.time | date:'dd.MM.yyyy HH:mm' }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="order-items">
        <h3>Товары в заказе</h3>
        <table>
          <thead>
            <tr><th>Наименование</th><th>Количество</th><th>Цена</th><th>Сумма</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of order.items">
              <td>{{item.name}}</td>
              <td>{{item.quantity}}</td>
              <td>{{item.price | number}} ₽</td>
              <td>{{item.price * item.quantity | number}} ₽</td>
            </tr>
          </tbody>
          <tfoot>
            <tr><td colspan="3"><strong>Итого:</strong></td><td><strong>{{order.totalPrice | number}} ₽</strong></td></tr>
          </tfoot>
        </table>
      </div>

      <div class="order-actions">
        <button (click)="refresh(order.id)" class="refresh-btn">🔄 Обновить</button>
        <select *ngIf="order.status !== 'delivered'" (change)="changeStatus(order.id, $any($event.target).value)" [value]="''">
          <option value="" disabled>Изменить статус</option>
          <option *ngFor="let s of statuses" [value]="s" [hidden]="s === order.status">{{s}}</option>
        </select>
      </div>
    </div>
    <ng-template #empty>
      <div class="order-details-empty">
        <p>Введите номер заказа для отслеживания</p>
        <p class="hint">Попробуйте: 12345, 67890, 99999</p>
      </div>
    </ng-template>
  `,
  styles: [],
})
export class OrderDetailsComponent {
  private query = inject(OrderQuery);
  order$ = this.query.currentOrder$;

  statuses = ['created', 'processing', 'shipped', 'delivered'];

  constructor(public facade: OrderFacade) {}

  refresh(id: string) {
    this.facade.fetchOrder(id);
  }

  changeStatus(id: string, status: string) {
    if (status) {
      this.facade.updateOrderStatus(id, status);
    }
  }
}
