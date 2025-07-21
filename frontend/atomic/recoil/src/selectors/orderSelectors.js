import {selector, selectorFamily} from 'recoil';
import {
    ordersState,
    currentOrderIdState,
    orderIdsState,
    favoritesState,
    orderFiltersState,
} from '../atoms/orderAtoms';

// Селектор текущего заказа
export const currentOrderSelector = selector({
    key: 'currentOrderSelector',
    get: ({get}) => {
        const orders = get(ordersState);
        const currentId = get(currentOrderIdState);
        return currentId ? orders[currentId] : null;
    },
});

// Селектор для проверки, является ли заказ избранным
export const isOrderFavoriteSelector = selectorFamily({
    key: 'isOrderFavoriteSelector',
    get: (orderId) => ({get}) => {
        const favorites = get(favoritesState);
        return favorites.includes(orderId);
    },
});

// Селектор отфильтрованных заказов
export const filteredOrdersSelector = selector({
    key: 'filteredOrdersSelector',
    get: ({get}) => {
        const orders = get(ordersState);
        const orderIds = get(orderIdsState);
        const filters = get(orderFiltersState);

        let filteredIds = orderIds;

        if (filters.status) {
            filteredIds = filteredIds.filter(id => orders[id]?.status === filters.status);
        }

        if (filters.city) {
            filteredIds = filteredIds.filter(id =>
                orders[id]?.city.toLowerCase().includes(filters.city.toLowerCase())
            );
        }

        if (filters.search) {
            filteredIds = filteredIds.filter(id => {
                const order = orders[id];
                return order?.id.includes(filters.search) ||
                    order?.customer.toLowerCase().includes(filters.search.toLowerCase()) ||
                    order?.trackingNumber.toLowerCase().includes(filters.search.toLowerCase());
            });
        }

        return filteredIds.map(id => orders[id]);
    },
});

// Селектор избранных заказов
export const favoriteOrdersSelector = selector({
    key: 'favoriteOrdersSelector',
    get: ({get}) => {
        const orders = get(ordersState);
        const favorites = get(favoritesState);
        return favorites.map(id => orders[id]).filter(Boolean);
    },
});
