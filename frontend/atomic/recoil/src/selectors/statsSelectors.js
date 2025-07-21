import {selector} from 'recoil';
import {ordersState, orderIdsState} from '../atoms/orderAtoms';

export const orderStatsSelector = selector({
    key: 'orderStatsSelector',
    get: ({get}) => {
        const orders = get(ordersState);
        const orderIds = get(orderIdsState);

        const orderArray = orderIds.map(id => orders[id]).filter(Boolean);

        if (orderArray.length === 0) {
            return {
                total: 0,
                byStatus: {},
                totalRevenue: 0,
                averageOrderValue: 0,
                topCities: [],
            };
        }

        const stats = {
            total: orderArray.length,
            byStatus: {},
            totalRevenue: 0,
            topCities: {},
        };

        orderArray.forEach(order => {
            // Статус
            stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;

            // Выручка
            stats.totalRevenue += order.totalPrice;

            // Города
            stats.topCities[order.city] = (stats.topCities[order.city] || 0) + 1;
        });

        stats.averageOrderValue = stats.totalRevenue / orderArray.length;
        stats.topCities = Object.entries(stats.topCities)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([city, count]) => ({city, count}));

        return stats;
    },
});
