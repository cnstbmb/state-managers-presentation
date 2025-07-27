import { Component, OnDestroy, inject, effect, EffectRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderFacade, OrderQuery } from '../state';
import { OrderState } from '../state/order.store';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="order-list">
      <div class="filters" *ngIf="filters() as filters">
        <input type="text" placeholder="Поиск по ID, клиенту, трек-номеру" [value]="filters.search" (input)="updateFilters({search: $any($event.target).value})" />
        <select [value]="filters.status" (change)="updateFilters({status: $any($event.target).value})">
          <option value="">Все статусы</option>
          <option value="created">Created</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
        <input type="text" placeholder="Город" [value]="filters.city" (input)="updateFilters({city: $any($event.target).value})" />
        <button (click)="facade.fetchOrders()" [disabled]="loading()">{{ (loading()) ? 'Загрузка...' : 'Обновить' }}</button>
      </div>

      <div class="orders-grid">
        <div *ngFor="let order of orders()" class="order-card">
          <div class="order-card-header">
            <h3 (click)="open(order.id)">Заказ #{{order.id}}</h3>
            <button class="favorite-btn-small" (click)="toggleFavorite(order.id); $event.stopPropagation()">{{ facade.isFavorite(order.id) ? '★' : '☆' }}</button>
          </div>
          <p><strong>Клиент:</strong> {{order.customer}}</p>
          <p><strong>Город:</strong> {{order.city}}</p>
          <p><strong>Статус:</strong> <span class="status status-{{order.status}}">{{order.status}}</span></p>
          <p><strong>Сумма:</strong> {{order.totalPrice | number}} ₽</p>
          <p><strong>Дата:</strong> {{ order.createdAt | date:'dd.MM.yyyy' }}</p>
        </div>
      </div>

      <ng-container *ngIf="pagination() as p">
        <div class="pagination" *ngIf="p.totalPages > 1">
          <button (click)="changePage(p.page - 1)" [disabled]="p.page === 1">← Назад</button>
          <span>Страница {{p.page}} из {{p.totalPages}}</span>
          <button (click)="changePage(p.page + 1)" [disabled]="p.page === p.totalPages">Вперед →</button>
        </div>
      </ng-container>
    </div>
  `,
  styles: [],
})
export class OrderListComponent implements OnDestroy {
  private query = inject(OrderQuery);
  orders = this.query.selectAll;
  loading = this.query.loading;
  filters = this.query.filters;
  pagination = this.query.pagination;
  private eff: EffectRef;
  private prevFilters: OrderState['filters'] | null = null;

  constructor(public facade: OrderFacade) {
    this.eff = effect(
      () => {
        const current = this.filters();
        if (this.prevFilters !== current) {
          this.prevFilters = current;
          this.facade.fetchOrders();
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnDestroy() {
    this.eff.destroy();
  }

  open(id: string) {
    this.facade.fetchOrder(id);
    this.facade.setViewMode('single');
  }

  toggleFavorite(id: string) {
    this.facade.toggleFavorite(id);
  }

  updateFilters(filters: any) {
    this.facade.updateFilters(filters);
  }

  changePage(page: number) {
    this.facade.updateFilters({ page });
  }
}
