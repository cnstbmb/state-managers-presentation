import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Order } from '../services/order.service';

export interface OrderState extends EntityState<Order> {
  currentId: string | null;
  viewMode: 'single' | 'list' | 'stats';
  favorites: string[];
  loading: boolean;
  error: string | null;
  pagination: { total: number; page: number; limit: number; totalPages: number };
  filters: { status: string; city: string; search: string; page: number; limit: number };
  notification: { type: string; message: string } | null;
}

function createInitialState(): OrderState {
  return {
    entities: {},
    ids: [],
    currentId: null,
    viewMode: 'single',
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    loading: false,
    error: null,
    pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
    filters: { status: '', city: '', search: '', page: 1, limit: 12 },
    notification: null,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'orders', idKey: 'id' })
export class OrderStore extends EntityStore<OrderState, Order> {
  constructor() {
    super(createInitialState());
  }
}
