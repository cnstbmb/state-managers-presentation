// src/App.jsx
import React from 'react';
import { useOrdersState } from './hooks/useOrderSelectors';
import { useFavoriteOrders } from './hooks/useOrderSelectors';
import { OrderSearch } from './components/OrderSearch';
import { OrderDetails } from './components/OrderDetails';
import { OrderList } from './components/OrderList';
import { OrderStats } from './components/OrderStats';
import { Notification } from './components/Notification';

import './App.css';

function App() {
    const { viewMode, error } = useOrdersState();
    const favoriteOrders = useFavoriteOrders();

    return (
        <div className="app">
            <header className="app-header">
                <h1>📦 Отслеживание заказов (Redux)</h1>
                <div className="header-info">
                    <span>Избранных: {favoriteOrders.length}</span>
                </div>
            </header>

            <Notification />

            <main className="app-main">
                <OrderSearch />

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                <div className="content">
                    {viewMode === 'single' && <OrderDetails />}
                    {viewMode === 'list' && <OrderList />}
                    {viewMode === 'stats' && <OrderStats />}
                </div>

                {favoriteOrders.length > 0 && viewMode === 'single' && (
                    <div className="favorites-sidebar">
                        <h3>Избранные заказы</h3>
                        {favoriteOrders.map(order => (
                            <div key={order.id} className="favorite-item">
                                <span>#{order.id}</span>
                                <span className={`status status-${order.status}`}>
                  {order.status}
                </span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
