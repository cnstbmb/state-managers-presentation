import { makeAutoObservable, runInAction } from 'mobx';
import { orderAPI } from '../services/api';

class OrderStore {
    orders = {};
    orderIds = [];
    currentOrderId = null;
    favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    filters = { status: '', city: '', search: '', page: 1, limit: 12 };
    pagination = { total: 0, page: 1, limit: 12, totalPages: 0 };
    viewMode = 'single';
    loading = false;
    error = null;
    notification = null;

    constructor() {
        makeAutoObservable(this);
    }

    setViewMode(mode) {
        this.viewMode = mode;
    }

    clearNotification() {
        this.notification = null;
    }

    isFavorite(id) {
        return this.favorites.includes(id);
    }

    toggleFavorite(id) {
        if (this.favorites.includes(id)) {
            this.favorites = this.favorites.filter(f => f !== id);
        } else {
            this.favorites.push(id);
        }
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    updateFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters, page: newFilters.page || 1 };
    }

    async fetchOrder(orderId) {
        this.loading = true;
        this.error = null;
        try {
            const response = await orderAPI.getOrder(orderId);
            const order = response.data.data;
            runInAction(() => {
                this.orders[order.id] = order;
                this.currentOrderId = orderId;
                if (order.status === 'delivered') {
                    this.notification = { type: 'success', message: 'Заказ доставлен! 🎉' };
                    setTimeout(() => this.clearNotification(), 3000);
                }
            });
            return order;
        } catch (err) {
            runInAction(() => {
                this.error = err.response?.data?.error || 'Ошибка загрузки заказа';
            });
            throw err;
        } finally {
            runInAction(() => { this.loading = false; });
        }
    }

    async fetchOrders() {
        const params = this.filters;
        this.loading = true;
        this.error = null;
        try {
            const response = await orderAPI.getOrders(params);
            const { data, pagination } = response.data;
            const newOrders = {};
            const ids = [];
            data.forEach(o => { newOrders[o.id] = o; ids.push(o.id); });
            runInAction(() => {
                this.orders = { ...this.orders, ...newOrders };
                this.orderIds = ids;
                this.pagination = pagination;
            });
            return data;
        } catch (err) {
            runInAction(() => {
                this.error = err.response?.data?.error || 'Ошибка загрузки заказов';
            });
            throw err;
        } finally {
            runInAction(() => { this.loading = false; });
        }
    }

    async updateOrderStatus(id, status) {
        this.loading = true;
        this.error = null;
        try {
            const res = await orderAPI.updateOrderStatus(id, status);
            const updated = res.data.data;
            runInAction(() => {
                this.orders[updated.id] = updated;
                this.notification = { type: 'success', message: `Статус заказа обновлен: ${status}` };
                setTimeout(() => this.clearNotification(), 3000);
            });
            return updated;
        } catch (err) {
            runInAction(() => {
                this.error = err.response?.data?.error || 'Ошибка обновления статуса';
            });
            throw err;
        } finally {
            runInAction(() => { this.loading = false; });
        }
    }

    get currentOrder() {
        return this.currentOrderId ? this.orders[this.currentOrderId] : null;
    }

    get filteredOrders() {
        const { orders, orderIds, filters } = this;
        let ids = orderIds;
        if (filters.status) ids = ids.filter(id => orders[id]?.status === filters.status);
        if (filters.city) ids = ids.filter(id =>
            orders[id]?.city.toLowerCase().includes(filters.city.toLowerCase())
        );
        if (filters.search) {
            const s = filters.search.toLowerCase();
            ids = ids.filter(id => {
                const o = orders[id];
                return o?.id.includes(filters.search) ||
                    o?.customer.toLowerCase().includes(s) ||
                    o?.trackingNumber.toLowerCase().includes(s);
            });
        }
        return ids.map(id => orders[id]).filter(Boolean);
    }

    get favoriteOrders() {
        return this.favorites.map(id => this.orders[id]).filter(Boolean);
    }

    get orderStats() {
        const orderArray = this.orderIds.map(id => this.orders[id]).filter(Boolean);
        if (orderArray.length === 0) {
            return {
                total: 0,
                byStatus: { created: 0, processing: 0, shipped: 0, delivered: 0 },
                totalRevenue: 0,
                averageOrderValue: 0,
                topCities: [],
            };
        }
        const stats = {
            total: orderArray.length,
            byStatus: { created: 0, processing: 0, shipped: 0, delivered: 0 },
            totalRevenue: 0,
            cityStats: {},
        };
        orderArray.forEach(order => {
            stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;
            stats.totalRevenue += order.totalPrice;
            stats.cityStats[order.city] = (stats.cityStats[order.city] || 0) + 1;
        });
        stats.averageOrderValue = stats.totalRevenue / orderArray.length;
        stats.topCities = Object.entries(stats.cityStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([city, count]) => ({ city, count }));
        return stats;
    }
}

export const orderStore = new OrderStore();
