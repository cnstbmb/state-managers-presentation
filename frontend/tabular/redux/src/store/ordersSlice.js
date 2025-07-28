import { configureStore, createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { normalize, denormalize, schema } from 'normalizr';
import { orderAPI } from '../services/api';

const itemSchema = new schema.Entity('items');
const orderSchema = new schema.Entity('orders', { items: [itemSchema] });
const ordersListSchema = [orderSchema];

export const fetchOrder = createAsyncThunk('orders/fetchOrder', async (orderId, { rejectWithValue }) => {
    try {
        const res = await orderAPI.getOrder(orderId);
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Ошибка загрузки заказа');
    }
});

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { getState, rejectWithValue }) => {
    try {
        const { filters } = getState().orders;
        const res = await orderAPI.getOrders(filters);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Ошибка загрузки заказов');
    }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const res = await orderAPI.updateOrderStatus(id, status);
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Ошибка обновления статуса');
    }
});

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        entities: { orders: {}, items: {} },
        orderIds: [],
        currentOrderId: null,
        favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
        filters: { status: '', city: '', search: '', page: 1, limit: 12 },
        pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
        viewMode: 'single',
        loading: false,
        error: null,
        notification: null,
    },
    reducers: {
        setViewMode(state, action) {
            state.viewMode = action.payload;
        },
        clearNotification(state) {
            state.notification = null;
        },
        toggleFavorite(state, action) {
            const id = action.payload;
            if (state.favorites.includes(id)) {
                state.favorites = state.favorites.filter(f => f !== id);
            } else {
                state.favorites.push(id);
            }
            localStorage.setItem('favorites', JSON.stringify(state.favorites));
        },
        updateFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload, page: action.payload.page || 1 };
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchOrder.pending, state => { state.loading = true; state.error = null; })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                const normalized = normalize(action.payload, orderSchema);
                state.entities.orders = { ...state.entities.orders, ...normalized.entities.orders };
                state.entities.items = { ...state.entities.items, ...normalized.entities.items };
                state.currentOrderId = action.payload.id;
                if (action.payload.status === 'delivered') {
                    state.notification = { type: 'success', message: 'Заказ доставлен! 🎉' };
                }
                state.loading = false;
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrders.pending, state => { state.loading = true; state.error = null; })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                const { data, pagination } = action.payload;
                const normalized = normalize(data, ordersListSchema);
                state.entities.orders = { ...state.entities.orders, ...normalized.entities.orders };
                state.entities.items = { ...state.entities.items, ...normalized.entities.items };
                state.orderIds = normalized.result;
                state.pagination = pagination;
                state.loading = false;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateOrderStatus.pending, state => { state.loading = true; state.error = null; })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const normalized = normalize(action.payload, orderSchema);
                state.entities.orders = { ...state.entities.orders, ...normalized.entities.orders };
                state.entities.items = { ...state.entities.items, ...normalized.entities.items };
                state.notification = { type: 'success', message: `Статус заказа обновлен: ${action.payload.status}` };
                state.loading = false;
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setViewMode, clearNotification, toggleFavorite, updateFilters } = ordersSlice.actions;

export const store = configureStore({ reducer: { orders: ordersSlice.reducer } });

export const selectOrdersState = state => state.orders;

export const selectCurrentOrder = state => {
    const { currentOrderId, entities } = state.orders;
    return currentOrderId
        ? denormalize(currentOrderId, orderSchema, entities)
        : null;
};

export const selectFilteredOrders = createSelector(selectOrdersState, ordersState => {
    const { entities, orderIds, filters } = ordersState;
    let ids = orderIds;
    if (filters.status) ids = ids.filter(id => entities.orders[id]?.status === filters.status);
    if (filters.city) ids = ids.filter(id => entities.orders[id]?.city.toLowerCase().includes(filters.city.toLowerCase()));
    if (filters.search) {
        const s = filters.search.toLowerCase();
        ids = ids.filter(id => {
            const o = entities.orders[id];
            return o?.id.includes(filters.search) || o?.customer.toLowerCase().includes(s) || o?.trackingNumber.toLowerCase().includes(s);
        });
    }
    return ids.map(id => entities.orders[id]).filter(Boolean);
});

export const selectFavoriteOrders = createSelector(selectOrdersState, state => state.favorites.map(id => state.entities.orders[id]).filter(Boolean));

export const selectOrderStats = createSelector(selectOrdersState, state => {
    const orderArray = state.orderIds.map(id => state.entities.orders[id]).filter(Boolean);
    if (orderArray.length === 0) {
        return { total: 0, byStatus: { created: 0, processing: 0, shipped: 0, delivered: 0 }, totalRevenue: 0, averageOrderValue: 0, topCities: [] };
    }
    const stats = { total: orderArray.length, byStatus: { created: 0, processing: 0, shipped: 0, delivered: 0 }, totalRevenue: 0, cityStats: {} };
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

