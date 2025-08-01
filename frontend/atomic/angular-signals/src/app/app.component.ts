import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificationComponent, OrderSearchComponent, OrderDetailsComponent, OrderListComponent, OrderStatsComponent } from './components';
import { OrderQuery } from './state';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    NotificationComponent,
    OrderSearchComponent,
    OrderDetailsComponent,
    OrderListComponent,
    OrderStatsComponent,
  ],
  template: `
    <div class="app">
      <header class="app-header">
        <h1>📦 Отслеживание заказов (Angular Signals)</h1>
        <div class="header-info">
          <span>Избранных: {{ favorites().length }}</span>
        </div>
      </header>

      <app-notification></app-notification>

      <main class="app-main">
        <app-order-search></app-order-search>

        <div *ngIf="error() as error" class="error-message">⚠️ {{error}}</div>

        <div class="content">
          <app-order-details *ngIf="viewMode() === 'single'"></app-order-details>
          <app-order-list *ngIf="viewMode() === 'list'"></app-order-list>
          <app-order-stats *ngIf="viewMode() === 'stats'"></app-order-stats>
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  private query = inject(OrderQuery);
  favorites = this.query.favorites;
  viewMode = this.query.viewMode;
  error = this.query.error;
}
