import { useOrderStore } from './useOrderStore';

export const useOrderActions = () => {
    const store = useOrderStore();
    return {
        fetchOrder: store.fetchOrder.bind(store),
        fetchOrders: store.fetchOrders.bind(store),
        toggleFavorite: store.toggleFavorite.bind(store),
        updateOrderStatus: store.updateOrderStatus.bind(store),
        updateFilters: store.updateFilters.bind(store),
        clearNotification: store.clearNotification.bind(store),
        isFavorite: store.isFavorite.bind(store),
        setViewMode: store.setViewMode.bind(store),
    };
};
