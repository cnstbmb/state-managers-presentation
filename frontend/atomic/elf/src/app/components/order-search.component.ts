import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderFacade, OrderQuery } from '../state';

@Component({
  selector: 'app-order-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="order-search">
      <form (ngSubmit)="onSubmit()">
        <input type="text" [(ngModel)]="value" name="order" placeholder="Введите номер заказа (например: 12345)" [disabled]="(loading$ | async) ?? false" />
        <button type="submit" [disabled]="(loading$ | async) ?? false">Найти</button>
      </form>
      <div class="view-mode-buttons">
        <button (click)="facade.setViewMode('single')" [class.active]="(viewMode$ | async) === 'single'">Поиск заказа</button>
        <button (click)="facade.setViewMode('list')" [class.active]="(viewMode$ | async) === 'list'">Все заказы</button>
        <button (click)="facade.setViewMode('stats')" [class.active]="(viewMode$ | async) === 'stats'">Статистика</button>
      </div>
    </div>
  `,
  styles: [],
})
export class OrderSearchComponent {
  private query = inject(OrderQuery);
  value = '';
  loading$ = this.query.loading$;
  viewMode$ = this.query.viewMode$;

  constructor(public facade: OrderFacade) {}

  async onSubmit() {
    if (this.value.trim()) {
      await this.facade.fetchOrder(this.value.trim());
    }
  }
}
