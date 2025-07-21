import React, {useEffect} from 'react';
import {useRecoilValue, useRecoilState} from 'recoil';
import {filteredOrdersSelector} from '../selectors/orderSelectors';
import {orderFiltersState, paginationState} from '../atoms/orderAtoms';
import {viewModeState} from '../atoms/uiAtoms';
import {useOrders} from '../hooks/useOrders';

export const OrderList = () => {
    const filteredOrders = useRecoilValue(filteredOrdersSelector);
    const [filters, setFilters] = useRecoilState(orderFiltersState);
    const pagination = useRecoilValue(paginationState);
    const setViewMode = useRecoilState(viewModeState)[1];
    const {fetchOrders, fetchOrder, toggleFavorite, loading} = useOrders();

    useEffect(() => {
        fetchOrders();
    }, [filters]); // Загружаем при изменении фильтров

    const handleOrderClick = (orderId) => {
        fetchOrder(orderId);
        setViewMode('single');
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({...prev, page: newPage}));
    };

    return (<div className="order-list">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Поиск по ID, клиенту, трек-номеру"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({...prev, search: e.target.value, page: 1}))}
                />

                <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({...prev, status: e.target.value, page: 1}))}
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
                    onChange={(e) => setFilters(prev => ({...prev, city: e.target.value, page: 1}))}
                />

                <button onClick={fetchOrders} disabled={loading}>
                    {loading ? 'Загрузка...' : 'Обновить'}
                </button>
            </div>

            <div className="orders-grid">
                {filteredOrders.map(order => (<div key={order.id} className="order-card">
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
                                {order.isFavorite ? '★' : '☆'}
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
                    </div>))}
            </div>

            {pagination.totalPages > 1 && (<div className="pagination">
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
                </div>)}
        </div>);
};
