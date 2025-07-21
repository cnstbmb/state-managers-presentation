import {useRecoilState, useSetRecoilState, useRecoilValue} from 'recoil';
import {useCallback} from 'react';
import {
    ordersState, orderIdsState, currentOrderIdState, favoritesState, orderFiltersState, paginationState,
} from '../atoms/orderAtoms';
import {
    loadingState, errorState, notificationState,
} from '../atoms/uiAtoms';
import {orderAPI} from '../services/api';

export const useOrders = () => {
    const [orders, setOrders] = useRecoilState(ordersState);
    const [orderIds, setOrderIds] = useRecoilState(orderIdsState);
    const setCurrentOrderId = useSetRecoilState(currentOrderIdState);
    const [favorites, setFavorites] = useRecoilState(favoritesState);
    const [loading, setLoading] = useRecoilState(loadingState);
    const [error, setError] = useRecoilState(errorState);
    const setNotification = useSetRecoilState(notificationState);
    const [filters, setFilters] = useRecoilState(orderFiltersState);
    const setPagination = useSetRecoilState(paginationState);

    // Получить заказ по ID
    const fetchOrder = useCallback(async (orderId) => {
        setLoading(true);
        setError(null);
        setCurrentOrderId(orderId);

        try {
            const response = await orderAPI.getOrder(orderId);
            const order = response.data.data;

            setOrders(prev => ({
                ...prev, [order.id]: order,
            }));

            if (order.status === 'delivered') {
                setNotification({
                    type: 'success', message: 'Заказ доставлен! 🎉',
                });

                setTimeout(() => setNotification(null), 3000);
            }

            return order;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Ошибка загрузки заказа';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setOrders, setCurrentOrderId, setLoading, setError, setNotification]);

    // Получить список заказов
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await orderAPI.getOrders(filters);
            const {data, pagination} = response.data;

            const newOrders = {};
            const newOrderIds = [];

            data.forEach(order => {
                newOrders[order.id] = order;
                newOrderIds.push(order.id);
            });

            setOrders(prev => ({
                ...prev, ...newOrders,
            }));
            setOrderIds(newOrderIds);
            setPagination(pagination);

            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Ошибка загрузки заказов';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [filters, setOrders, setOrderIds, setPagination, setLoading, setError]);

    // Переключить избранное
    const toggleFavorite = useCallback((orderId) => {
        setFavorites(prev => {
            if (prev.includes(orderId)) {
                return prev.filter(id => id !== orderId);
            }
            return [...prev, orderId];
        });
    }, [setFavorites]);

    // Обновить статус заказа
    const updateOrderStatus = useCallback(async (orderId, newStatus) => {
        setLoading(true);
        setError(null);

        try {
            const response = await orderAPI.updateOrderStatus(orderId, newStatus);
            const updatedOrder = response.data.data;

            setOrders(prev => ({
                ...prev, [updatedOrder.id]: updatedOrder,
            }));

            setNotification({
                type: 'success', message: `Статус заказа обновлен: ${newStatus}`,
            });

            setTimeout(() => setNotification(null), 3000);

            return updatedOrder;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Ошибка обновления статуса';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setOrders, setLoading, setError, setNotification]);

    // Обновить фильтры
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({
            ...prev, ...newFilters, page: newFilters.page || 1, // Сбрасываем на первую страницу при изменении фильтров
        }));
    }, [setFilters]);

    return {
        orders, loading, error, favorites, fetchOrder, fetchOrders, toggleFavorite, updateOrderStatus, updateFilters,
    };
};
