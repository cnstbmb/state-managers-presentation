import React from 'react';
import {useRecoilValue} from 'recoil';
import {OrderSearch} from './components/OrderSearch';
import {OrderDetails} from './components/OrderDetails';
import {OrderList} from './components/OrderList';
import {OrderStats} from './components/OrderStats';
import {Notification} from './components/Notification';
import {viewModeState} from './atoms/uiAtoms';
import {errorState} from './atoms/uiAtoms';
import {favoriteOrdersSelector} from './selectors/orderSelectors';
import './App.css';

function App() {
    const viewMode = useRecoilValue(viewModeState);
    const error = useRecoilValue(errorState);
    const favoriteOrders = useRecoilValue(favoriteOrdersSelector);

    return (
        <div className="app">
            <header className="app-header">
                <h1>📦 Отслеживание заказов (Recoil)</h1>
                <div className="header-info">
                    <span>Избранных: {favoriteOrders.length}</span>
                </div>
            </header>

            <Notification/>

            <main className="app-main">
                <OrderSearch/>

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                <div className="content">
                    {viewMode === 'single' && <OrderDetails/>}
                    {viewMode === 'list' && <OrderList/>}
                    {viewMode === 'stats' && <OrderStats/>}
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
