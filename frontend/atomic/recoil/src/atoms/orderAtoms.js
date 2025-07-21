import {atom} from 'recoil';

// Основные атомы для заказов
export const ordersState = atom({
    key: 'ordersState',
    default: {},
});

export const orderIdsState = atom({
    key: 'orderIdsState',
    default: [],
});

export const currentOrderIdState = atom({
    key: 'currentOrderIdState',
    default: null,
});

export const favoritesState = atom({
    key: 'favoritesState',
    default: JSON.parse(localStorage.getItem('favorites') || '[]'),
    effects: [
        ({onSet}) => {
            onSet((newValue) => {
                localStorage.setItem('favorites', JSON.stringify(newValue));
            });
        },
    ],
});

export const orderFiltersState = atom({
    key: 'orderFiltersState',
    default: {
        status: '',
        city: '',
        search: '',
        page: 1,
        limit: 12,
    },
});

export const paginationState = atom({
    key: 'paginationState',
    default: {
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
    },
});
