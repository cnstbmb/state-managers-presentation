import { Injectable } from '@angular/core';
import { createStore, withProps, select, type Reducer } from '@ngneat/elf';
import { withEntities, upsertEntities, setEntities } from '@ngneat/elf-entities';
import { Order } from '../services/order.service';

export interface OrderState {
  ids: string[];
  entities: Record<string, Order>;
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
    ids: [],
    entities: {},
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
export class OrderStore {
  private store = createStore(
    { name: 'orders' },
    withProps<OrderState>(createInitialState()),
    withEntities<Order>({ idKey: 'id' })
  );

  select<R>(selector: (state: OrderState) => R) {
    return this.store.pipe(select(selector));
  }

  pipe = this.store.pipe.bind(this.store);

  update(...reducers: Array<Reducer<OrderState>>) {
    this.store.update(...reducers);
  }

  getValue() {
    return this.store.getValue();
  }

  upsert(id: string, entity: Order) {
    this.store.update(upsertEntities(entity));
  }

  set(entities: Record<string, Order>) {
    this.store.update(setEntities(Object.values(entities)));
  }
}
