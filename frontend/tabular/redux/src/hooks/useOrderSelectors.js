import { useSelector } from 'react-redux';
import { selectCurrentOrder, selectFilteredOrders, selectFavoriteOrders, selectOrderStats } from '../store/ordersSlice';

export const useCurrentOrder = () => useSelector(selectCurrentOrder);
export const useFilteredOrders = () => useSelector(selectFilteredOrders);
export const useFavoriteOrders = () => useSelector(selectFavoriteOrders);
export const useOrderStats = () => useSelector(selectOrderStats);
export const useOrdersState = () => useSelector(state => state.orders);
