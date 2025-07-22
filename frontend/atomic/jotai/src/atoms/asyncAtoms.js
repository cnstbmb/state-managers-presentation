import { atom } from 'jotai';
import { orderAPI } from '../services/api';
import {
    ordersAtom,
    orderIdsAtom,
    currentOrderIdAtom,
    filtersAtom,
    paginationAtom,
} from './orderAtoms';
import {
    loadingAtom,
    errorAtom,
    notificationAtom,
} from './uiAtoms';

// Асинхронный атом для загрузки заказа
export const fetchOrderAtom = atom(
    null,
    async (get, set, orderId) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const response = await orderAPI.getOrder(orderId);
            const order = response.data.data;

            set(ordersAtom, (prev) => ({ ...prev, [order.id]: order }));
            set(currentOrderIdAtom, orderId);

            if (order.status === 'delivered') {
                set(notificationAtom, {
                    type: 'success',
                    message: 'Заказ доставлен! 🎉'
                });
            }

            return order;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Ошибка загрузки заказа';
            set(errorAtom, errorMessage);
            throw error;
        } finally {
            set(loadingAtom, false);
        }
    }
);

// Асинхронный атом для загрузки списка заказов
export const fetchOrdersAtom = atom(
    null,
    async (get, set) => {
        const filters = get(filtersAtom);
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const response = await orderAPI.getOrders(filters);
            const { data, pagination } = response.data;

            const newOrders = {};
            const newOrderIds = [];

            data.forEach(order => {
                newOrders[order.id] = order;
                newOrderIds.push(order.id);
            });

            set(ordersAtom, (prev) => ({ ...prev, ...newOrders }));
            set(orderIdsAtom, newOrderIds);
            set(paginationAtom, pagination);

            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Ошибка загрузки заказов';
            set(errorAtom, errorMessage);
            throw error;
        } finally {
            set(loadingAtom, false);
        }
    }
);
