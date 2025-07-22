import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import {
    ordersAtom,
    favoritesAtom,
    currentOrderIdAtom,
    filtersAtom,
} from '../atoms/orderAtoms';
import {
    loadingAtom,
    errorAtom,
    notificationAtom,
} from '../atoms/uiAtoms';
import {
    fetchOrderAtom,
    fetchOrdersAtom,
} from '../atoms/asyncAtoms';
import { orderAPI } from '../services/api';

export const useOrderActions = () => {
    const [favorites, setFavorites] = useAtom(favoritesAtom);
    const setOrders = useSetAtom(ordersAtom);
    const setCurrentOrderId = useSetAtom(currentOrderIdAtom);
    const setLoading = useSetAtom(loadingAtom);
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const fetchOrder = useSetAtom(fetchOrderAtom);
    const fetchOrders = useSetAtom(fetchOrdersAtom);
    const [filters, setFilters] = useAtom(filtersAtom);

    const toggleFavorite = useCallback((orderId) => {
        setFavorites((prev) => {
            if (prev.includes(orderId)) {
                return prev.filter(id => id !== orderId);
            }
            return [...prev, orderId];
        });
    }, [setFavorites]);

    const updateOrderStatus = useCallback(async (orderId, newStatus) => {
        setLoading(true);
        setError(null);

        try {
            const response = await orderAPI.updateOrderStatus(orderId, newStatus);
            const updatedOrder = response.data.data;

            setOrders((prev) => ({
                ...prev,
                [updatedOrder.id]: updatedOrder,
            }));

            setNotification({
                type: 'success',
                message: `Статус заказа обновлен: ${newStatus}`,
            });

            setTimeout(() => setNotification(null), 3000);

            return updatedOrder;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Ошибка обновления статуса';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [setOrders, setLoading, setError, setNotification]);

    const updateFilters = useCallback((newFilters) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || 1,
        }));
    }, [setFilters]);

    const clearNotification = useCallback(() => {
        setNotification(null);
    }, [setNotification]);

    const isFavorite = useCallback((orderId) => {
        return favorites.includes(orderId);
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
