import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { viewModeAtom } from '../stores/orderStores';
import { loadingAtom } from '../stores/uiStores';
import { useOrderActions } from '../hooks/useOrderActions';

export const OrderSearch = () => {
    const [inputValue, setInputValue] = useState('');
    const viewMode = useStore(viewModeAtom);
    const loading = useStore(loadingAtom);
    const { fetchOrder } = useOrderActions();

    const setViewMode = (mode) => viewModeAtom.set(mode);

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
                    {loading ? 'Загрузка...' : 'Найти'}
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
