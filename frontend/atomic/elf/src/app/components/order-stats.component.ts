import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderFacade } from '../state';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-order-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="stats; else loading">
      <div class="order-stats">
        <h2>Статистика заказов</h2>

        <div class="stats-grid">
          <div class="stat-card">
            <h3>Всего заказов</h3>
            <div class="stat-value">{{stats.total}}</div>
          </div>
          <div class="stat-card">
            <h3>Общая выручка</h3>
            <div class="stat-value">{{stats.totalRevenue | number}} ₽</div>
          </div>
          <div class="stat-card">
            <h3>Средний чек</h3>
            <div class="stat-value">{{stats.averageOrderValue | number}} ₽</div>
          </div>
        </div>

        <div class="stats-section">
          <h3>По статусам</h3>
          <div class="status-stats">
            <div *ngFor="let entry of statusEntries()" class="status-stat">
              <span class="status status-{{entry[0]}}">{{entry[0]}}</span>
              <span class="count">{{entry[1]}}</span>
            </div>
          </div>
        </div>

        <div class="stats-section">
          <h3>Топ городов</h3>
          <div class="city-stats">
            <div *ngFor="let c of stats.topCities" class="city-stat">
              <span class="city">{{c.city}}</span>
              <div class="bar-container">
                <div class="bar" [style.width.%]="(c.count / stats.total) * 100"></div>
                <span class="count">{{c.count}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-section" *ngIf="stats.recentOrders">
          <h3>Последние заказы</h3>
          <table class="recent-orders">
            <thead>
            <tr><th>ID</th><th>Клиент</th><th>Статус</th><th>Сумма</th></tr>
            </thead>
            <tbody>
            <tr *ngFor="let o of stats.recentOrders">
              <td>{{o.id}}</td>
              <td>{{o.customer}}</td>
              <td><span class="status status-{{o.status}}">{{o.status}}</span></td>
              <td>{{o.total | number}} ₽</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ng-container>
    <ng-template #loading>
      <div class="loading">Загрузка статистики...</div>
    </ng-template>
  `,
  styles: [],
})
export class OrderStatsComponent implements OnInit {
  stats: any;
  loading = false;
  constructor(private facade: OrderFacade) {}

  async ngOnInit() {
    this.loading = true;
    const res = await firstValueFrom(this.facade['api'].getStats());
    this.stats = res.data;
    this.loading = false;
  }

  statusEntries() {
    return Object.entries(this.stats?.byStatus || {});
  }
}
