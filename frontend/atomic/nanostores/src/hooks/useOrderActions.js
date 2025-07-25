import { useStore } from '@nanostores/react';
import { useCallback } from 'react';
import {
    ordersAtom,
    orderIdsAtom,
    favoritesAtom,
    currentOrderIdAtom,
    filtersAtom,
    paginationAtom
} from '../stores/orderStores';
import {
    loadingAtom,
    errorAtom,
    notificationAtom,
} from '../stores/uiStores';
import { orderAPI } from '../services/api';

export const useOrderActions = () => {
    const favorites = useStore(favoritesAtom);
    const filters = useStore(filtersAtom);

    const toggleFavorite = useCallback((orderId) => {
        const current = favoritesAtom.get();
        const updated = current.includes(orderId)
            ? current.filter(id => id !== orderId)
            : [...current, orderId];
        favoritesAtom.set(updated);
    }, [favorites]);

    const fetchOrder = useCallback(async (orderId) => {
        loadingAtom.set(true);
        errorAtom.set(null);
        try {
            const response = await orderAPI.getOrder(orderId);
            const order = response.data.data;
            ordersAtom.set({ ...ordersAtom.get(), [order.id]: order });
            currentOrderIdAtom.set(orderId);

            if (order.status === 'delivered') {
                notificationAtom.set({ type: 'success', message: 'Заказ доставлен! 🎉' });
                setTimeout(() => notificationAtom.set(null), 3000);
            }
            return order;
        } catch (err) {
            const message = err.response?.data?.error || 'Ошибка загрузки заказа';
            errorAtom.set(message);
            throw err;
        } finally {
            loadingAtom.set(false);
        }
    }, [favorites]);

    const fetchOrders = useCallback(async () => {
        loadingAtom.set(true);
        errorAtom.set(null);
        try {
            const response = await orderAPI.getOrders(filtersAtom.get());
            const { data, pagination } = response.data;
            const newOrders = {};
            const newIds = [];
            data.forEach(order => { newOrders[order.id] = order; newIds.push(order.id); });
            ordersAtom.set({ ...ordersAtom.get(), ...newOrders });
            orderIdsAtom.set(newIds);
            paginationAtom.set(pagination);
            return data;
        } catch (err) {
            const message = err.response?.data?.error || 'Ошибка загрузки заказов';
            errorAtom.set(message);
            throw err;
        } finally {
            loadingAtom.set(false);
        }
    }, [filters]);

    const updateOrderStatus = useCallback(async (orderId, newStatus) => {
        loadingAtom.set(true);
        errorAtom.set(null);
        try {
            const response = await orderAPI.updateOrderStatus(orderId, newStatus);
            const updatedOrder = response.data.data;
            ordersAtom.set({ ...ordersAtom.get(), [updatedOrder.id]: updatedOrder });
            notificationAtom.set({ type: 'success', message: `Статус заказа обновлен: ${newStatus}` });
            setTimeout(() => notificationAtom.set(null), 3000);
            return updatedOrder;
        } catch (err) {
            const message = err.response?.data?.error || 'Ошибка обновления статуса';
            errorAtom.set(message);
            throw err;
        } finally {
            loadingAtom.set(false);
        }
    }, []);

    const updateFilters = useCallback((newFilters) => {
        filtersAtom.set({ ...filtersAtom.get(), ...newFilters, page: newFilters.page || 1 });
    }, []);

    const clearNotification = useCallback(() => {
        notificationAtom.set(null);
    }, []);

    const isFavorite = useCallback((orderId) => {
        return favoritesAtom.get().includes(orderId);
    }, [favorites]);

    return {
        fetchOrder,
        fetchOrders,
        toggleFavorite,
        updateOrderStatus,
        updateFilters,
        clearNotification,
        isFavorite,
    };
};
