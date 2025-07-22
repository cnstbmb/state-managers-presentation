import React from 'react';
import { useAtomValue } from 'jotai';
import { currentOrderAtom } from '../atoms/orderAtoms';
import { useOrderActions } from '../hooks/useOrderActions';

export const OrderDetails = () => {
    const currentOrder = useAtomValue(currentOrderAtom);
    const { toggleFavorite, fetchOrder, updateOrderStatus, isFavorite } = useOrderActions();

    if (!currentOrder) {
        return (
            <div className="order-details-empty">
                <p>Введите номер заказа для отслеживания</p>
                <p className="hint">Попробуйте: 12345, 67890, 99999</p>
            </div>
        );
    }

    const isOrderFavorite = isFavorite(currentOrder.id);

    const handleStatusChange = (newStatus) => {
        updateOrderStatus(currentOrder.id, newStatus);
    };

    return (
        <div className="order-details">
            <div className="order-header">
                <h2>Заказ #{currentOrder.id}</h2>
                <button
                    onClick={() => toggleFavorite(currentOrder.id)}
                    className={`favorite-btn ${isOrderFavorite ? 'active' : ''}`}
                >
                    {isOrderFavorite ? '★' : '☆'} Избранное
                </button>
            </div>

            <div className="order-info">
                <p><strong>Клиент:</strong> {currentOrder.customer}</p>
                <p><strong>Адрес:</strong> {currentOrder.address}</p>
                <p><strong>Трек-номер:</strong> {currentOrder.trackingNumber}</p>
                <p><strong>Статус:</strong>
                    <span className={`status status-${currentOrder.status}`}>
            {currentOrder.status}
          </span>
                </p>
            </div>

            <div className="order-progress">
                <h3>Прогресс доставки</h3>
                <div className="progress-steps">
                    {currentOrder.steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`step ${step.completed ? 'completed' : ''}`}
                        >
                            <div className="step-marker"></div>
                            <div className="step-info">
                                <div className="step-status">{step.status}</div>
                                {step.time && (
                                    <div className="step-time">
                                        {new Date(step.time).toLocaleString('ru-RU')}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="order-items">
                <h3>Товары в заказе</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Наименование</th>
                        <th>Количество</th>
                        <th>Цена</th>
                        <th>Сумма</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentOrder.items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price.toLocaleString('ru-RU')} ₽</td>
                            <td>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="3"><strong>Итого:</strong></td>
                        <td><strong>{currentOrder.totalPrice.toLocaleString('ru-RU')} ₽</strong></td>
                    </tr>
                    </tfoot>
                </table>
            </div>

            <div className="order-actions">
                <button onClick={() => fetchOrder(currentOrder.id)} className="refresh-btn">
                    🔄 Обновить
                </button>

                {currentOrder.status !== 'delivered' && (
                    <select
                        onChange={(e) => handleStatusChange(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Изменить статус</option>
                        {['created', 'processing', 'shipped', 'delivered']
                            .filter(s => s !== currentOrder.status)
                            .map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))
                        }
                    </select>
                )}
            </div>
        </div>
    );
};
