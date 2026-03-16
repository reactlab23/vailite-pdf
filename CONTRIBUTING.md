# Руководство по участию в разработке

Спасибо за интерес к проекту! Этот документ поможет вам внести свой вклад.

---

## 🚀 Начало работы

### 1. Форк и клонирование

```bash
# Форкните репозиторий на GitHub
# Затем клонируйте свой форк
git clone https://github.com/YOUR_USERNAME/kp-psychologist-generator.git
cd kp-psychologist-generator

# Добавьте upstream для синхронизации
git remote add upstream https://github.com/ORIGINAL_OWNER/kp-psychologist-generator.git
```

### 2. Установка зависимостей

```bash
# Node.js зависимости
bun install

# Python зависимости
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
pip install reportlab pillow
```

### 3. Настройка окружения

```bash
# Создайте .env из примера
cp .env.example .env

# Отредактируйте .env и добавьте свой ZAI_API_KEY
```

### 4. Запуск

```bash
bun run dev
```

---

## 📋 Процесс разработки

### Ветвление

```
main        → Стабильная версия
develop     → Разработка
feature/*   → Новые функции
fix/*       → Исправления багов
docs/*      → Документация
```

### Создание ветки

```bash
# Обновите main
git checkout main
git pull upstream main

# Создайте ветку для функции
git checkout -b feature/my-new-feature
```

### Коммиты

Используйте понятные сообщения:

```
feat: добавлена генерация DOCX
fix: исправлена ошибка парсинга JSON
docs: обновлён README
style: форматирование кода
refactor: рефакторинг PDF-генератора
test: добавлены тесты для API
chore: обновлены зависимости
```

### Pull Request

1. Убедитесь, что код проходит `bun run lint`
2. Протестируйте изменения вручную
3. Создайте PR с описанием изменений
4. Свяжите PR с issue (если есть)

---

## 🎨 Стиль кода

### TypeScript/React

```typescript
// Используйте type для интерфейсов
type MyType = {
  field: string;
};

// Компоненты — функциональные
export function MyComponent({ prop }: MyComponentProps) {
  return <div>{prop}</div>;
}

// Хуки — в начале компонента
const [state, setState] = useState<string>('');
const { data } = useQuery();

// Async функции — с try/catch
async function fetchData() {
  try {
    const res = await fetch('/api/data');
    return res.json();
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Python

```python
# Используйте type hints
def generate_pdf(data: PdfData) -> str:
    """Генерирует Python-скрипт для PDF."""
    return script

# Константы — UPPER_CASE
MAX_PAGES = 4
DEFAULT_FONT = "DejaVuSans"

# Функции — snake_case
def create_styles():
    pass
```

### CSS/Tailwind

```tsx
// Используйте Tailwind классы
<div className="flex flex-col gap-4 p-6 bg-background">

// Семантические элементы
<main className="min-h-screen">
  <header>...</header>
  <section>...</section>
  <footer>...</footer>
</main>
```

---

## 📁 Где что находится

| Что | Где |
|-----|-----|
| Главная страница | `src/app/page.tsx` |
| API endpoints | `src/app/api/*/route.ts` |
| Компоненты UI | `src/components/*.tsx` |
| shadcn/ui | `src/components/ui/*.tsx` |
| Типы | `src/lib/types.ts` |
| Промпты | `src/lib/prompts.ts` |
| PDF генератор | `src/lib/pdf-generator.ts` |
| LLM интеграция | `src/lib/zai.ts` |

---

## ✅ Чек-лист перед PR

- [ ] Код работает локально
- [ ] `bun run lint` без ошибок
- [ ] Нет `console.log` в продакшн-коде
- [ ] TypeScript типы корректны
- [ ] Документация обновлена (если нужно)
- [ ] CHANGELOG обновлён (для значимых изменений)

---

## 🐛 Сообщение о багах

Создайте issue с информацией:

1. **Описание** — что произошло
2. **Шаги** — как воспроизвести
3. **Ожидание** — что должно было быть
4. **Скриншоты** — если применимо
5. **Окружение** — OS, Node, Python версии

---

## 💡 Предложения функций

1. Создайте issue с тегом `enhancement`
2. Опкажите идею и пользу
3. Обсудите с мейнтейнерами
4. Приступайте к реализации

---

## 📞 Контакты

- **Telegram:** [@VadimCrypton](https://t.me/VadimCrypton)
- **Сайт:** [vailite.ru](https://vailite.ru)

---

## 📄 Лицензия

Внося вклад, вы соглашаетесь, что ваш код будет лицензирован под MIT License.
