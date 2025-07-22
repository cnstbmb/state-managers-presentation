# Jotai Order Tracking App

Демонстрационное приложение для отслеживания заказов, построенное с использованием Jotai - примитивной и гибкой библиотеки управления состоянием для React.

## Особенности Jotai в этом примере

### 1. **Атомы (Atoms)**
- Простые атомы для хранения данных (`ordersAtom`, `currentOrderIdAtom`)
- Атомы с localStorage (`favoritesAtom` через `atomWithLocalStorage`)
- Производные атомы (`currentOrderAtom`, `filteredOrdersAtom`)
- Асинхронные атомы (`fetchOrderAtom`, `serverStatsAtom`)

### 2. **Архитектурные особенности**
- **Bottom-up подход** - строим состояние из маленьких независимых атомов
- **React Suspense поддержка** - асинхронные атомы работают с Suspense из коробки
- **Минимальный API** - всего несколько основных функций
- **TypeScript-friendly** - отличная поддержка типов

### 3. **Паттерны использования**

#### Атом с localStorage:
```javascript
export const atomWithLocalStorage = (key, initialValue) => {
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
  return derivedAtom;
};
