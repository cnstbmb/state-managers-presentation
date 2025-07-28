import { useDispatch } from 'react-redux';
import {
    fetchOrder,
    fetchOrders,
    toggleFavorite,
    updateOrderStatus,
    updateFilters,
    clearNotification,
    setViewMode,
} from '../store/ordersSlice';
import { useCallback } from 'react';

export const useOrderActions = () => {
    const dispatch = useDispatch();

    const fetchOrderById = useCallback((id) => {
        dispatch(fetchOrder(id));
    }, [dispatch]);

    const fetchOrdersList = useCallback(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const toggleFavoriteOrder = useCallback((id) => {
        dispatch(toggleFavorite(id));
    }, [dispatch]);

    const changeOrderStatus = useCallback((id, status) => {
        dispatch(updateOrderStatus({ id, status }));
    }, [dispatch]);

    const changeFilters = useCallback((filters) => {
        dispatch(updateFilters(filters));
    }, [dispatch]);

    const dismissNotification = useCallback(() => {
        dispatch(clearNotification());
    }, [dispatch]);

    const changeViewMode = useCallback((mode) => {
        dispatch(setViewMode(mode));
    }, [dispatch]);

    return {
        fetchOrder: fetchOrderById,
        fetchOrders: fetchOrdersList,
        toggleFavorite: toggleFavoriteOrder,
        updateOrderStatus: changeOrderStatus,
        updateFilters: changeFilters,
        clearNotification: dismissNotification,
        setViewMode: changeViewMode,
    };
};
