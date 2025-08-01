import React, { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
    filteredOrdersAtom,
    filtersAtom,
    paginationAtom,
    viewModeAtom
} from '../atoms/orderAtoms';
import { loadingAtom } from '../atoms/uiAtoms';
import { useOrderActions } from '../hooks/useOrderActions';

export const OrderList = () => {
    const filteredOrders = useAtomValue(filteredOrdersAtom);
    const [filters] = useAtom(filtersAtom);
    const pagination = useAtomValue(paginationAtom);
    const [loading] = useAtom(loadingAtom);
    const setViewMode = useSetAtom(viewModeAtom);
    const { fetchOrders, fetchOrder, toggleFavorite, updateFilters, isFavorite } = useOrderActions();

    useEffect(() => {
        fetchOrders();
    }, [filters, fetchOrders]);

    const handleOrderClick = (orderId) => {
        fetchOrder(orderId);
        setViewMode('single');
    };

    const handlePageChange = (newPage) => {
        updateFilters({ page: newPage });
    };

    return (
        <div className="order-list">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Поиск по ID, клиенту, трек-номеру"
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                />

                <select
                    value={filters.status}
                    onChange={(e) => updateFilters({ status: e.target.value })}
                >
                    <option value="">Все статусы</option>
                    <option value="created">Created</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                </select>

                <input
                    type="text"
                    placeholder="Город"
                    value={filters.city}
                    onChange={(e) => updateFilters({ city: e.target.value })}
                />

                <button onClick={fetchOrders} disabled={loading}>
                    {loading ? 'Загрузка...' : 'Обновить'}
                </button>
            </div>

            <div className="orders-grid">
                {filteredOrders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-card-header">
                            <h3 onClick={() => handleOrderClick(order.id)}>
                                Заказ #{order.id}
                            </h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(order.id);
                                }}
                                className="favorite-btn-small"
                            >
                                {isFavorite(order.id) ? '★' : '☆'}
                            </button>
                        </div>
                        <p><strong>Клиент:</strong> {order.customer}</p>
                        <p><strong>Город:</strong> {order.city}</p>
                        <p><strong>Статус:</strong>
                            <span className={`status status-${order.status}`}>
                {order.status}
              </span>
                        </p>
                        <p><strong>Сумма:</strong> {order.totalPrice.toLocaleString('ru-RU')} ₽</p>
                        <p><strong>Дата:</strong> {new Date(order.createdAt).toLocaleDateString('ru-RU')}</p>
                    </div>
                ))}
            </div>

            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                    >
                        ← Назад
                    </button>
                    <span>
            Страница {pagination.page} из {pagination.totalPages}
          </span>
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                    >
                        Вперед →
                    </button>
                </div>
            )}
        </div>
    );
};
