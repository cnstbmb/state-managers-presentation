import { atom } from 'jotai';
import { atomWithLocalStorage } from '../utils/atomWithLocalStorage';

// Основные атомы
export const ordersAtom = atom({});
export const currentOrderIdAtom = atom(null);
export const orderIdsAtom = atom([]);

// Атом с localStorage для избранного
export const favoritesAtom = atomWithLocalStorage('favorites', []);

// Фильтры
export const filtersAtom = atom({
    status: '',
    city: '',
    search: '',
    page: 1,
    limit: 12,
});

// Пагинация
export const paginationAtom = atom({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
});

// Режим отображения
export const viewModeAtom = atom('single'); // 'single' | 'list' | 'stats'

// Производные атомы (derived atoms)
export const currentOrderAtom = atom((get) => {
    const orders = get(ordersAtom);
    const currentId = get(currentOrderIdAtom);
    return currentId ? orders[currentId] : null;
});

export const filteredOrderIdsAtom = atom((get) => {
    const orders = get(ordersAtom);
    const orderIds = get(orderIdsAtom);
    const filters = get(filtersAtom);

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
        const searchLower = filters.search.toLowerCase();
        filteredIds = filteredIds.filter(id => {
            const order = orders[id];
            return order?.id.includes(filters.search) ||
                order?.customer.toLowerCase().includes(searchLower) ||
                order?.trackingNumber.toLowerCase().includes(searchLower);
        });
    }

    return filteredIds;
});

export const filteredOrdersAtom = atom((get) => {
    const orders = get(ordersAtom);
    const filteredIds = get(filteredOrderIdsAtom);
    return filteredIds.map(id => orders[id]).filter(Boolean);
});

export const favoriteOrdersAtom = atom((get) => {
    const orders = get(ordersAtom);
    const favorites = get(favoritesAtom);
    return favorites.map(id => orders[id]).filter(Boolean);
});

export const orderStatsAtom = atom((get) => {
    const orders = get(ordersAtom);
    const orderIds = get(orderIdsAtom);

    const orderArray = orderIds.map(id => orders[id]).filter(Boolean);

    if (orderArray.length === 0) {
        return {
            total: 0,
            byStatus: {
                created: 0,
                processing: 0,
                shipped: 0,
                delivered: 0,
            },
            totalRevenue: 0,
            averageOrderValue: 0,
            topCities: [],
        };
    }

    const stats = {
        total: orderArray.length,
        byStatus: {
            created: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
        },
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
});
