const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// =====================================================
// ДАННЫЕ И ГЕНЕРАЦИЯ
// =====================================================

// Справочники для генерации
const ITEMS_CATALOG = [
    {name: 'iPhone 14 Pro', price: 99990, category: 'electronics'},
    {name: 'MacBook Pro M2', price: 189990, category: 'electronics'},
    {name: 'AirPods Pro', price: 19990, category: 'electronics'},
    {name: 'iPad Air', price: 59990, category: 'electronics'},
    {name: 'Apple Watch Series 8', price: 39990, category: 'electronics'},
    {name: 'Кофемашина DeLonghi', price: 45990, category: 'appliances'},
    {name: 'Робот-пылесос Xiaomi', price: 25990, category: 'appliances'},
    {name: 'Телевизор Samsung 55"', price: 79990, category: 'electronics'},
    {name: 'PlayStation 5', price: 54990, category: 'gaming'},
    {name: 'Xbox Series X', price: 49990, category: 'gaming'},
    {name: 'Наушники Sony WH-1000XM5', price: 29990, category: 'audio'},
    {name: 'Клавиатура Keychron K2', price: 8990, category: 'accessories'},
    {name: 'Монитор LG 27"', price: 34990, category: 'electronics'},
    {name: 'Веб-камера Logitech', price: 7990, category: 'accessories'},
    {name: 'SSD Samsung 1TB', price: 9990, category: 'storage'}
];

const CUSTOMERS = [
    {name: 'Иван Иванов', city: 'Москва', address: 'ул. Пушкина, д. 10'},
    {name: 'Петр Петров', city: 'Санкт-Петербург', address: 'пр. Невский, д. 20'},
    {name: 'Анна Сидорова', city: 'Новосибирск', address: 'ул. Ленина, д. 5'},
    {name: 'Мария Козлова', city: 'Екатеринбург', address: 'ул. Мира, д. 15'},
    {name: 'Алексей Смирнов', city: 'Казань', address: 'ул. Баумана, д. 8'},
    {name: 'Елена Волкова', city: 'Нижний Новгород', address: 'пл. Минина, д. 3'},
    {name: 'Дмитрий Морозов', city: 'Челябинск', address: 'пр. Ленина, д. 45'},
    {name: 'Ольга Новикова', city: 'Самара', address: 'ул. Куйбышева, д. 12'},
    {name: 'Сергей Попов', city: 'Омск', address: 'ул. Маркса, д. 7'},
    {name: 'Татьяна Лебедева', city: 'Ростов-на-Дону', address: 'ул. Большая Садовая, д. 25'}
];

const ORDER_STATUSES = ['created', 'processing', 'shipped', 'delivered'];

// Функция генерации заказов
function generateOrders() {
    const orders = {};

    // Генерируем 50 случайных заказов
    for (let i = 0; i < 50; i++) {
        const orderId = (10000 + i).toString();
        const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
        const statusIndex = Math.floor(Math.random() * ORDER_STATUSES.length);
        const status = ORDER_STATUSES[statusIndex];

        // Генерируем товары для заказа (от 1 до 5 товаров)
        const orderItems = [];
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const usedItems = new Set();

        for (let j = 0; j < itemCount; j++) {
            let itemIndex;
            do {
                itemIndex = Math.floor(Math.random() * ITEMS_CATALOG.length);
            } while (usedItems.has(itemIndex));
            usedItems.add(itemIndex);

            orderItems.push({
                id: j + 1,
                ...ITEMS_CATALOG[itemIndex],
                quantity: Math.floor(Math.random() * 3) + 1
            });
        }

        // Генерируем временные метки
        const now = new Date();
        const createdDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);

        const steps = ORDER_STATUSES.map((stepStatus, index) => ({
            status: stepStatus,
            completed: index <= statusIndex,
            time: index <= statusIndex
                ? new Date(createdDate.getTime() + index * 12 * 60 * 60 * 1000).toISOString()
                : null
        }));

        const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        orders[orderId] = {
            id: orderId,
            status,
            items: orderItems,
            customer: customer.name,
            address: `${customer.city}, ${customer.address}`,
            city: customer.city,
            totalPrice,
            deliveryTime: statusIndex === 3
                ? steps[3].time
                : new Date(createdDate.getTime() + 72 * 60 * 60 * 1000).toISOString(),
            currentStep: statusIndex + 1,
            steps,
            createdAt: createdDate.toISOString(),
            trackingNumber: `RU${orderId}${customer.city.substring(0, 3).toUpperCase()}`
        };
    }

    // Добавляем фиксированные заказы для демонстрации
    orders['12345'] = createDemoOrder('12345', 'delivered', 'Демо Пользователь', 'Москва');
    orders['67890'] = createDemoOrder('67890', 'shipped', 'Тестовый Клиент', 'Санкт-Петербург');
    orders['99999'] = createDemoOrder('99999', 'processing', 'VIP Клиент', 'Москва');

    return orders;
}

// Вспомогательная функция для создания демо-заказов
function createDemoOrder(id, status, customerName, city) {
    const statusIndex = ORDER_STATUSES.indexOf(status);
    const now = new Date();
    const createdDate = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const demoItems = {
        '12345': [
            {id: 1, name: 'iPhone 14 Pro', price: 99990, quantity: 1, category: 'electronics'},
            {id: 2, name: 'AirPods Pro', price: 19990, quantity: 1, category: 'electronics'}
        ],
        '67890': [
            {id: 1, name: 'MacBook Pro M2', price: 189990, quantity: 1, category: 'electronics'},
            {id: 2, name: 'Клавиатура Keychron K2', price: 8990, quantity: 1, category: 'accessories'}
        ],
        '99999': [
            {id: 1, name: 'PlayStation 5', price: 54990, quantity: 1, category: 'gaming'},
            {id: 2, name: 'Телевизор Samsung 55"', price: 79990, quantity: 1, category: 'electronics'},
            {id: 3, name: 'Наушники Sony WH-1000XM5', price: 29990, quantity: 2, category: 'audio'}
        ]
    };

    const items = demoItems[id];
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const steps = ORDER_STATUSES.map((stepStatus, index) => ({
        status: stepStatus,
        completed: index <= statusIndex,
        time: index <= statusIndex
            ? new Date(createdDate.getTime() + index * 12 * 60 * 60 * 1000).toISOString()
            : null
    }));

    return {
        id,
        status,
        items,
        customer: customerName,
        address: `${city}, ул. Демонстрационная, д. ${id.slice(-2)}`,
        city,
        totalPrice,
        deliveryTime: statusIndex === 3
            ? steps[3].time
            : new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        currentStep: statusIndex + 1,
        steps,
        createdAt: createdDate.toISOString(),
        trackingNumber: `RU${id}${city.substring(0, 3).toUpperCase()}`,
        ...(id === '99999' && {isVip: true})
    };
}

// Инициализация данных
const orders = generateOrders();

// =====================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =====================================================

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// =====================================================
// MIDDLEWARE
// =====================================================

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// =====================================================
// API ENDPOINTS
// =====================================================

// Получить заказ по ID
app.get('/api/orders/:id', async (req, res) => {
    await delay(Math.random() * 1000 + 500); // Случайная задержка 500-1500ms

    const order = orders[req.params.id];
    if (order) {
        res.json({success: true, data: order});
    } else {
        res.status(404).json({success: false, error: 'Заказ не найден'});
    }
});

// Получить все заказы с пагинацией и фильтрацией
app.get('/api/orders', async (req, res) => {
    await delay(300);

    const {page = 1, limit = 10, status, city, search} = req.query;

    let filteredOrders = Object.values(orders);

    // Фильтрация
    if (status) {
        filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    if (city) {
        filteredOrders = filteredOrders.filter(order =>
            order.city.toLowerCase().includes(city.toLowerCase())
        );
    }

    if (search) {
        filteredOrders = filteredOrders.filter(order =>
            order.id.includes(search) ||
            order.customer.toLowerCase().includes(search.toLowerCase()) ||
            order.trackingNumber.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Сортировка по дате создания (новые первые)
    filteredOrders.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Пагинация
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    res.json({
        success: true,
        data: paginatedOrders,
        pagination: {
            total: filteredOrders.length,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(filteredOrders.length / limit)
        }
    });
});

// Получить статистику
app.get('/api/stats', async (req, res) => {
    await delay(200);

    const orderArray = Object.values(orders);
    const stats = {
        total: orderArray.length,
        byStatus: ORDER_STATUSES.reduce((acc, status) => {
            acc[status] = orderArray.filter(o => o.status === status).length;
            return acc;
        }, {}),
        totalRevenue: orderArray.reduce((sum, order) => sum + order.totalPrice, 0),
        averageOrderValue: orderArray.reduce((sum, order) => sum + order.totalPrice, 0) / orderArray.length,
        topCities: Object.entries(
            orderArray.reduce((acc, order) => {
                acc[order.city] = (acc[order.city] || 0) + 1;
                return acc;
            }, {})
        )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([city, count]) => ({city, count})),
        recentOrders: orderArray
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(o => ({id: o.id, customer: o.customer, status: o.status, total: o.totalPrice}))
    };

    res.json({success: true, data: stats});
});

// Обновить статус заказа
app.patch('/api/orders/:id/status', async (req, res) => {
    await delay(500);

    const order = orders[req.params.id];
    if (!order) {
        return res.status(404).json({success: false, error: 'Заказ не найден'});
    }

    const {status} = req.body;

    if (!ORDER_STATUSES.includes(status)) {
        return res.status(400).json({
            success: false,
            error: 'Неверный статус. Допустимые: ' + ORDER_STATUSES.join(', ')
        });
    }

    // Обновляем статус и шаги
    order.status = status;
    const statusIndex = ORDER_STATUSES.indexOf(status);
    order.currentStep = statusIndex + 1;

    // Обновляем временные метки для шагов
    const now = new Date();
    order.steps.forEach((step, index) => {
        if (index <= statusIndex) {
            step.completed = true;
            if (!step.time) {
                step.time = new Date(now.getTime() - (statusIndex - index) * 60 * 60 * 1000).toISOString();
            }
        } else {
            step.completed = false;
            step.time = null;
        }
    });

    if (status === 'delivered') {
        order.deliveryTime = now.toISOString();
    }

    res.json({success: true, data: order});
});

// =====================================================
// ЗАПУСК СЕРВЕРА
// =====================================================

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`
    🚀 Server running on http://localhost:${PORT}
    📦 Сгенерировано ${Object.keys(orders).length} заказов
    
    Примеры запросов:
    - GET http://localhost:${PORT}/api/orders/12345
    - GET http://localhost:${PORT}/api/orders?page=1&limit=10
    - GET http://localhost:${PORT}/api/stats
    
    Демо ID заказов: 12345, 67890, 99999
    Случайные ID: ${Object.keys(orders).slice(3, 8).join(', ')}
  `);
});

module.exports = {app, orders};
