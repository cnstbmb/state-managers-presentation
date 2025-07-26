import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { map } from 'rxjs/operators';
import { OrderStore, OrderState } from './order.store';
import { Order } from '../services/order.service';

@Injectable({ providedIn: 'root' })
export class OrderQuery extends QueryEntity<OrderState, Order> {
  currentOrder$;
  favorites$;
  viewMode$;
  loading$;
  error$;
  notification$;
  pagination$;
  filters$;

  constructor(protected override store: OrderStore) {
    super(store);
    this.currentOrder$ = this.select((state) => state.currentId).pipe(
      map((id) => (id ? this.getEntity(id) : null))
    );
    this.favorites$ = this.select((state) => state.favorites).pipe(
      map((ids) => ids.map((id) => this.getEntity(id)).filter(Boolean))
    );
    this.viewMode$ = this.select('viewMode');
    this.loading$ = this.select('loading');
    this.error$ = this.select('error');
    this.notification$ = this.select('notification');
    this.pagination$ = this.select('pagination');
    this.filters$ = this.select('filters');
  }
}
