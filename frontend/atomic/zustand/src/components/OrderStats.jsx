import React, { useEffect, useState } from 'react';
import { useOrderStats } from '../store/useOrderStore';
import { orderAPI } from '../services/api';

export const OrderStats = () => {
    const localStats = useOrderStats();
    const [serverStats, setServerStats] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await orderAPI.getStats();
                setServerStats(response.data.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = serverStats || localStats;

    if (loading) {
        return <div className="loading">Загрузка статистики...</div>;
    }

    return (
        <div className="order-stats">
            <h2>Статистика заказов</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Всего заказов</h3>
                    <div className="stat-value">{stats.total}</div>
                </div>

                <div className="stat-card">
                    <h3>Общая выручка</h3>
                    <div className="stat-value">
                        {stats.totalRevenue.toLocaleString('ru-RU')} ₽
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Средний чек</h3>
                    <div className="stat-value">
                        {Math.round(stats.averageOrderValue).toLocaleString('ru-RU')} ₽
                    </div>
                </div>
            </div>

            <div className="stats-section">
                <h3>По статусам</h3>
                <div className="status-stats">
                    {Object.entries(stats.byStatus).map(([status, count]) => (
                        <div key={status} className="status-stat">
                            <span className={`status status-${status}`}>{status}</span>
                            <span className="count">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="stats-section">
                <h3>Топ городов</h3>
                <div className="city-stats">
                    {stats.topCities.map(({ city, count }) => (
                        <div key={city} className="city-stat">
                            <span className="city">{city}</span>
                            <div className="bar-container">
                                <div
                                    className="bar"
                                    style={{ width: `${(count / stats.total) * 100}%` }}
                                />
                                <span className="count">{count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {serverStats?.recentOrders && (
                <div className="stats-section">
                    <h3>Последние заказы</h3>
                    <table className="recent-orders">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Клиент</th>
                            <th>Статус</th>
                            <th>Сумма</th>
                        </tr>
                        </thead>
                        <tbody>
                        {serverStats.recentOrders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer}</td>
                                <td>
                    <span className={`status status-${order.status}`}>
                      {order.status}
                    </span>
                                </td>
                                <td>{order.total.toLocaleString('ru-RU')} ₽</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
