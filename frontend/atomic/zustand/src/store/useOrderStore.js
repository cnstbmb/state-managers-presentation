import create from 'zustand';
import { orderAPI } from '../services/api';

export const useOrderStore = create((set, get) => ({
    orders: {},
    orderIds: [],
    currentOrderId: null,
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    filters: { status: '', city: '', search: '', page: 1, limit: 12 },
    pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
    viewMode: 'single',
    loading: false,
    error: null,
    notification: null,

    setViewMode: (mode) => set({ viewMode: mode }),

    clearNotification: () => set({ notification: null }),

    isFavorite: (id) => get().favorites.includes(id),

    toggleFavorite: (id) => set(state => {
        const favs = state.favorites.includes(id)
            ? state.favorites.filter(f => f !== id)
            : [...state.favorites, id];
        localStorage.setItem('favorites', JSON.stringify(favs));
        return { favorites: favs };
    }),

    updateFilters: (newFilters) => set(state => ({
        filters: { ...state.filters, ...newFilters, page: newFilters.page || 1 }
    })),

    fetchOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await orderAPI.getOrder(orderId);
            const order = response.data.data;
            set(state => ({
                orders: { ...state.orders, [order.id]: order },
                currentOrderId: orderId,
            }));
            if (order.status === 'delivered') {
                set({ notification: { type: 'success', message: 'Заказ доставлен! 🎉' } });
                setTimeout(() => get().clearNotification(), 3000);
            }
            return order;
        } catch (err) {
            const message = err.response?.data?.error || 'Ошибка загрузки заказа';
            set({ error: message });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    fetchOrders: async () => {
        const { filters } = get();
        set({ loading: true, error: null });
        try {
            const response = await orderAPI.getOrders(filters);
            const { data, pagination } = response.data;
            const newOrders = {};
            const newIds = [];
            data.forEach(o => { newOrders[o.id] = o; newIds.push(o.id); });
            set(state => ({
                orders: { ...state.orders, ...newOrders },
                orderIds: newIds,
                pagination,
            }));
            return data;
        } catch (err) {
            const message = err.response?.data?.error || 'Ошибка загрузки заказов';
            set({ error: message });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    updateOrderStatus: async (id, status) => {
        set({ loading: true, error: null });
        try {
            const res = await orderAPI.updateOrderStatus(id, status);
            const updated = res.data.data;
            set(state => ({ orders: { ...state.orders, [updated.id]: updated } }));
            set({ notification: { type: 'success', message: `Статус заказа обновлен: ${status}` } });
            setTimeout(() => get().clearNotification(), 3000);
            return updated;
        } catch (err) {
            const message = err.response?.data?.error || 'Ошибка обновления статуса';
            set({ error: message });
            throw err;
        } finally {
            set({ loading: false });
        }
    },
}));

export const useCurrentOrder = () => {
    const { orders, currentOrderId } = useOrderStore(state => ({
        orders: state.orders,
        currentOrderId: state.currentOrderId,
    }));
    return currentOrderId ? orders[currentOrderId] : null;
};

export const useFilteredOrders = () => {
    return useOrderStore(state => {
        const { orders, orderIds, filters } = state;
        let ids = orderIds;
        if (filters.status) ids = ids.filter(id => orders[id]?.status === filters.status);
        if (filters.city) ids = ids.filter(id => orders[id]?.city.toLowerCase().includes(filters.city.toLowerCase()));
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
    });
};

export const useFavoriteOrders = () => {
    return useOrderStore(state => state.favorites.map(id => state.orders[id]).filter(Boolean));
};

export const useOrderStats = () => {
    return useOrderStore(state => {
        const orderArray = state.orderIds.map(id => state.orders[id]).filter(Boolean);
        if (orderArray.length === 0) {
            return { total: 0, byStatus: { created: 0, processing: 0, shipped: 0, delivered: 0 }, totalRevenue: 0, averageOrderValue: 0, topCities: [] };
        }
        const stats = { total: orderArray.length, byStatus: { created: 0, processing: 0, shipped: 0, delivered: 0 }, totalRevenue: 0, cityStats: {} };
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
    });
};
