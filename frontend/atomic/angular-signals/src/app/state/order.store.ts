import { Injectable, signal, computed, WritableSignal } from '@angular/core';
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
  private state: WritableSignal<OrderState> = signal(createInitialState());

  readonly state$ = this.state.asReadonly();

  select<R>(selector: (state: OrderState) => R) {
    return computed(() => selector(this.state()));
  }

  getValue() {
    return this.state();
  }

  update(update: Partial<OrderState> | ((state: OrderState) => Partial<OrderState>)) {
    if (typeof update === 'function') {
      this.state.update(state => ({ ...state, ...(update as any)(state) }));
    } else {
      this.state.update(state => ({ ...state, ...update }));
    }
  }

  upsert(id: string, entity: Order) {
    this.state.update((state) => ({
      ...state,
      entities: { ...state.entities, [id]: entity },
      ids: state.ids.includes(id) ? state.ids : [...state.ids, id],
    }));
  }

  set(entities: Record<string, Order>) {
    this.state.update((state) => ({
      ...state,
      entities,
      ids: Object.keys(entities),
    }));
  }
}
