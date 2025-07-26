import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id: string;
  customer: string;
  address: string;
  city: string;
  status: string;
  items: { id: number; name: string; quantity: number; price: number; }[];
  totalPrice: number;
  createdAt: string;
  trackingNumber: string;
  steps: { status: string; completed: boolean; time?: string | null; }[];
}

export interface OrderListResponse {
  data: Order[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  getOrder(id: string): Observable<{ data: Order }> {
    return this.http.get<{ data: Order }>(`${this.baseUrl}/orders/${id}`);
  }

  getOrders(params: any): Observable<OrderListResponse> {
    return this.http.get<OrderListResponse>(`${this.baseUrl}/orders`, { params });
  }

  getStats(): Observable<{ data: any }> {
    return this.http.get<{ data: any }>(`${this.baseUrl}/stats`);
  }

  updateOrderStatus(id: string, status: string): Observable<{ data: Order }> {
    return this.http.patch<{ data: Order }>(`${this.baseUrl}/orders/${id}/status`, { status });
  }
}
