# Recoil Order Tracking App

Демонстрационное приложение для отслеживания заказов, построенное с использованием Recoil - экспериментального state
management library от Facebook.

## Особенности Recoil в этом примере

### 1. **Atoms (Атомы)**

- `ordersState` - хранилище всех заказов
- `currentOrderIdState` - ID текущего выбранного заказа
- `favoritesState` - список избранных заказов (с персистентностью в localStorage)
- `orderFiltersState` - фильтры для списка заказов
- `loadingState`, `errorState`, `notificationState` - UI состояния

### 2. **Selectors (Селекторы)**

- `currentOrderSelector` - вычисляемое значение текущего заказа
- `filteredOrdersSelector` - отфильтрованный список заказов
- `orderStatsSelector` - вычисляемая статистика
- `isOrderFavoriteSelector` - selector family для проверки избранного

### 3. **Effects**

- Автоматическое сохранение избранного в localStorage
- Синхронизация с backend API

### 4. **Архитектурные преимущества**

- Минимальный boilerplate
- Естественная работа с React Suspense
- Простая организация асинхронных запросов
- Атомарные обновления состояния

## Запуск проекта

1. Установите зависимости:

```bash
npm install
