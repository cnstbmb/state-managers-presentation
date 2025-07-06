# Блок-схема: Когда нужен state manager

Практическая блок-схема для принятия решения — нужен ли вашему JavaScript/TypeScript-проекту отдельный менеджер состояния (например, Redux, MobX, Zustand, Recoil и др.).

## 📜 Описание

Схема помогает определить:
- Размер и сложность приложения
- Частоту обновления и разделения данных
- Необходимость дополнительных инструментов для отладки и тестирования
- Архитектурные и масштабируемые требования

Используйте эту схему, чтобы решить: стоит ли внедрять state manager или лучше ограничиться локальным состоянием (через props/useState/context).

---

## 🖼️ Доступные форматы схемы

| Формат            | Ссылка                                                                                                                                                  |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| **PDF (векторный, максимальное качество)** | [Скачать PDF](https://github.com/cnstbmb/state-managers-presentation/raw/refs/heads/master/assets/state-manager-decision-flowchart/vector.jpg)               |
| **JPG (большой)**  | [Скачать JPG - Large](https://github.com/cnstbmb/state-managers-presentation/raw/refs/heads/master/assets/state-manager-decision-flowchart/large.jpg)   |
| **JPG (средний)**  | [Скачать JPG - Medium](https://github.com/cnstbmb/state-managers-presentation/raw/refs/heads/master/assets/state-manager-decision-flowchart/medium.jpg) |
| **JPG (маленький)**| [Скачать JPG - Small](https://github.com/cnstbmb/state-managers-presentation/raw/refs/heads/master/assets/state-manager-decision-flowchart/small.jpg)   |

---

## 📊 Превью

> _Для увеличения кликните на изображение или скачайте подробнее из таблицы выше._

[![State Manager Decision Flowchart](https://github.com/cnstbmb/state-managers-presentation/raw/refs/heads/master/assets/state-manager-decision-flowchart/medium.jpg)](https://github.com/cnstbmb/state-managers-presentation/raw/refs/heads/master/assets/state-manager-decision-flowchart/large.jpg)

---

## 🔍 Как пользоваться схемой

1. **Стартуйте слева** и последовательно отвечайте на вопросы про ваш проект.
2. **Двигайтесь по стрелкам** в зависимости от ваших ответов.
3. **Финальный результат:**
    - “State manager нужен” — имеет смысл рассматривать внедрение Redux, MobX, Zustand и других решений.
    - “State manager НЕ нужен” — скорее всего, достаточно локального состояния и prop drilling.

### Когда обычно нужен state manager:
- Сложное общее состояние между множеством компонентов
- Требования к предсказуемости, тестируемости и управляемой архитектуре
- Необходимость продвинутой отладки, time-travel, middleware
- Разработка в команде, масштабируемость проекта

---

## 🗂️ Организация файлов

- Все схемы находятся в каталоге `/assets` для удобства.
- Доступны как векторные (PDF), так и растровые (JPG) форматы.

---

## 💬 Обратная связь и предложения

Есть идеи улучшить схему, добавить вопросы или сделать перевод?  
Открывайте issue или присылайте PR!

---

## 📬 Автор

Сделано с ❤️ [cnstbmb](https://github.com/cnstbmb)  
Пусть в проекте будет больше ясности, а не лишнего состояния!
