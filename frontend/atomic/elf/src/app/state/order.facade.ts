import { Injectable } from '@angular/core';
import { OrderService, Order } from '../services/order.service';
import { OrderStore, OrderState } from './order.store';
import { firstValueFrom } from 'rxjs';
import { setProps } from '@ngneat/elf';

@Injectable({ providedIn: 'root' })
export class OrderFacade {
  constructor(private api: OrderService, private store: OrderStore) {}

  setViewMode(mode: 'single' | 'list' | 'stats') {
    this.store.update(setProps({ viewMode: mode }));
  }

  async fetchOrder(id: string) {
    this.store.update(setProps({ loading: true, error: null }));
    try {
      const res = await firstValueFrom(this.api.getOrder(id));
      const order = res.data;
      this.store.upsert(id, order);
      this.store.update(setProps({ currentId: id }));
      if (order.status === 'delivered') {
        this.store.update(setProps({ notification: { type: 'success', message: 'Заказ доставлен! 🎉' } }));
      }
    } catch (err: any) {
      this.store.update(setProps({ error: err.message || 'Ошибка загрузки заказа' }));
    } finally {
      this.store.update(setProps({ loading: false }));
    }
  }

  async fetchOrders() {
    const filters = this.store.getValue().filters;
    this.store.update(setProps({ loading: true, error: null }));
    try {
      const res = await firstValueFrom(this.api.getOrders(filters));
      const { data, pagination } = res;
      const entities: Record<string, Order> = {};
      data.forEach((o) => (entities[o.id] = o));
      this.store.set(entities);
      this.store.update(setProps({ pagination }));
    } catch (err: any) {
      this.store.update(setProps({ error: err.message || 'Ошибка загрузки заказов' }));
    } finally {
      this.store.update(setProps({ loading: false }));
    }
  }

  updateFilters(filters: Partial<OrderState['filters']>) {
    this.store.update((state) => ({
      ...state,
      filters: { ...state.filters, ...filters, page: filters.page || 1 }
    }));
  }

  toggleFavorite(id: string) {
    const favorites = this.store.getValue().favorites;
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    localStorage.setItem('favorites', JSON.stringify(updated));
    this.store.update(setProps({ favorites: updated }));
  }

  updateOrderStatus(id: string, status: string) {
    this.store.update(setProps({ loading: true, error: null }));
    this.api.updateOrderStatus(id, status).subscribe({
      next: (res) => {
        this.store.upsert(id, res.data);
        this.store.update(setProps({ notification: { type: 'success', message: `Статус заказа обновлен: ${status}` } }));
      },
      error: (err) => this.store.update(setProps({ error: err.message || 'Ошибка обновления статуса' })),
      complete: () => this.store.update(setProps({ loading: false }))
    });
  }

  clearNotification() {
    this.store.update(setProps({ notification: null }));
  }

  isFavorite(id: string) {
    return this.store.getValue().favorites.includes(id);
  }
}
