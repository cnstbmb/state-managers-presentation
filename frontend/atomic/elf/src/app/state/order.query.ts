import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { OrderStore } from './order.store';
import { selectAllEntities } from '@ngneat/elf-entities';

@Injectable({providedIn: 'root'})
export class OrderQuery {
    private store = inject(OrderStore);

    selectAll() {
        return this.store.pipe(selectAllEntities());
    }

    currentOrder$ = this.store.select(state => state.currentId).pipe(
        map(id => (id ? this.store.getValue().entities[id] : null))
    );

    favorites$ = this.store.select(state => state.favorites).pipe(
        map(ids => ids.map(id => this.store.getValue().entities[id]).filter(Boolean))
    );

    viewMode$ = this.store.select(state => state.viewMode);
    loading$ = this.store.select(state => state.loading);
    error$ = this.store.select(state => state.error);
    notification$ = this.store.select(state => state.notification);
    pagination$ = this.store.select(state => state.pagination);
    filters$ = this.store.select(state => state.filters);
}
