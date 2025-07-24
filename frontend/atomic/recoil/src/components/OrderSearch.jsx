import React, {useState} from 'react';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {viewModeState} from '../atoms/uiAtoms';
import {currentOrderIdState} from '../atoms/orderAtoms';
import {useOrders} from '../hooks/useOrders';

export const OrderSearch = () => {
    const [inputValue, setInputValue] = useState('');
    const [viewMode, setViewMode] = useRecoilState(viewModeState);
    const setCurrentOrderId = useSetRecoilState(currentOrderIdState);
    const {fetchOrder, loading} = useOrders();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setViewMode('single');
            await fetchOrder(inputValue.trim());
        }
    };

    return (
        <div className="order-search">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Введите номер заказа (например: 12345)"
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Поиск...' : 'Найти'}
                </button>
            </form>

            <div className="view-mode-buttons">
                <button
                    onClick={() => setViewMode('single')}
                    className={viewMode === 'single' ? 'active' : ''}
                >
                    Поиск заказа
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'active' : ''}
                >
                    Все заказы
                </button>
                <button
                    onClick={() => setViewMode('stats')}
                    className={viewMode === 'stats' ? 'active' : ''}
                >
                    Статистика
                </button>
            </div>
        </div>
    );
};
