import { useOrderStore } from '../store/useOrderStore';

export const useOrderActions = () =>
    useOrderStore(state => ({
        fetchOrder: state.fetchOrder,
        fetchOrders: state.fetchOrders,
        toggleFavorite: state.toggleFavorite,
        updateOrderStatus: state.updateOrderStatus,
        updateFilters: state.updateFilters,
        clearNotification: state.clearNotification,
        isFavorite: state.isFavorite,
        setViewMode: state.setViewMode,
    }));
