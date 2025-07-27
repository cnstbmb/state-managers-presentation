import { Injectable, computed } from '@angular/core';
import { OrderStore } from './order.store';

@Injectable({ providedIn: 'root' })
export class OrderQuery {
  selectAll;
  currentOrder;
  favorites;
  viewMode;
  loading;
  error;
  notification;
  pagination;
  filters;

  constructor(private store: OrderStore) {
    this.selectAll = computed(() => {
      const state = this.store.state$();
      return state.ids.map((id) => state.entities[id]);
    });

    this.currentOrder = computed(() => {
      const state = this.store.state$();
      const id = state.currentId;
      return id ? state.entities[id] : null;
    });

    this.favorites = computed(() => {
      const state = this.store.state$();
      return state.favorites.map((id) => state.entities[id]).filter(Boolean);
    });

    this.viewMode = this.store.select((s) => s.viewMode);
    this.loading = this.store.select((s) => s.loading);
    this.error = this.store.select((s) => s.error);
    this.notification = this.store.select((s) => s.notification);
    this.pagination = this.store.select((s) => s.pagination);
    this.filters = this.store.select((s) => s.filters);
  }
}
