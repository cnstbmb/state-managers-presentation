import React from 'react';
import { orderStore } from '../store/orderStore';

const StoreContext = React.createContext(orderStore);

export const StoreProvider = ({ children }) => (
    <StoreContext.Provider value={orderStore}>{children}</StoreContext.Provider>
);

export const useOrderStore = () => React.useContext(StoreContext);
