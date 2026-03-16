# 🧠 Генератор КП для психологов

**Версия 3.0** — AI-генератор персонализированных коммерческих предложений для психологов.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.12-yellow?style=flat-square&logo=python)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 О проекте

Автоматизированный генератор коммерческих предложений (КП) для психологов. Система анализирует профиль специалиста через AI и создаёт:

- **Персонализированный PDF** — 4 страницы с кейсами, темами контента и предложением
- **Текст для мессенджеров** — готовое сообщение для Telegram/WhatsApp
- **Кликабельные ссылки** — кнопки Telegram и сайта в PDF

### Ключевые особенности

- 🤖 **AI-анализ профиля** — извлекает специализацию, подход, боли
- 🎨 **Дизайн Vailite** — Amber-Orange палитра, glass-эффекты, анимации
- 📄 **PDF с поддержкой кириллицы** — шрифты DejaVu, тёмная тема
- 🎯 **Динамический контент** — темы и кейсы подбираются под нишу психолога
- ✨ **Анимации** — печатающийся текст, плавающие иконки, fade-in эффекты

---

## 🚀 Быстрый старт

### Требования

- Node.js 18+ / Bun
- Python 3.10+ с pip
- API ключ Z.AI (или другой LLM провайдер)

### Установка

```bash
# Клонируйте репозиторий
git clone https://github.com/your-org/kp-psychologist-generator.git
cd kp-psychologist-generator

# Установите зависимости Node.js
bun install

# Создайте виртуальное окружение Python
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# или venv\Scripts\activate  # Windows

# Установите Python-зависимости
pip install reportlab pillow

# Скопируйте .env.example в .env и заполните переменные
cp .env.example .env
```

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# База данных (опционально)
DATABASE_URL=file:./db/custom.db
```

### ⚠️ КРИТИЧНО: Z.AI конфигурация

**Обязательно создайте файл `.z-ai-config` в корне проекта:**

```bash
# Скопируйте пример
cp .z-ai-config.example .z-ai-config

# Отредактируйте и добавьте свой API ключ
```

**Формат `.z-ai-config`:**
```json
{
  "baseUrl": "https://api.z.ai/v1",
  "apiKey": "ВАШ_API_KEY_ЗДЕСЬ"
}
```

> ⚠️ Без этого файла приложение **не запустится** — будет ошибка "Config not found".

### Запуск

```bash
# Режим разработки
bun run dev

# Проверка кода
bun run lint

# Продакшн-сборка
bun run build
bun run start
```

Откройте http://localhost:3000 в браузере.

---

## 📁 Структура проекта

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # Главная страница
│   │   ├── layout.tsx            # Layout
│   │   ├── globals.css           # Глобальные стили
│   │   └── api/
│   │       ├── analyze/route.ts  # API анализа профиля
│   │       ├── generate-pdf/route.ts  # API генерации PDF
│   │       └── download/[filename]/route.ts  # API скачивания
│   ├── components/
│   │   ├── ProfileInput.tsx      # Ввод профиля (JSON)
│   │   ├── ResultDisplay.tsx     # Отображение результата
│   │   ├── TelegramText.tsx      # Текст для мессенджеров
│   │   ├── PdfDownload.tsx       # Кнопка скачивания PDF
│   │   └── ui/                   # shadcn/ui компоненты
│   ├── lib/
│   │   ├── types.ts              # TypeScript типы
│   │   ├── prompts.ts            # LLM промпты
│   │   ├── pdf-generator.ts      # Генератор Python-скрипта
│   │   ├── zai.ts                # Инициализация Z.AI SDK
│   │   └── utils.ts              # Утилиты
│   └── hooks/                    # React хуки
├── prisma/
│   └── schema.prisma             # Схема базы данных
├── public/
│   └── vailite-logo.jpeg         # Логотип Vailite
├── download/                     # Сгенерированные PDF
├── venv/                         # Python виртуальное окружение
├── README.md
├── CHANGELOG.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
└── .env.example
```

---

## 🔧 Как это работает

### 1. Ввод данных

Пользователь вводит профиль психолога в формате JSON:

```json
{
  "full_name": "Андрей Савенко",
  "city": "Москва",
  "description": "Практикующий психолог. Когнитивно-поведенческий подход...",
  "phone": "+7 913 380-83-42",
  "email": "example@yandex.ru",
  "social_links": ["https://t.me/example"]
}
```

### 2. AI-анализ (`/api/analyze`)

LLM анализирует профиль и извлекает:

- Имя для обращения
- Специализацию (тревога, депрессия, отношения...)
- Подход (КПТ, гештальт, психоанализ...)
- Опыт в годах
- Уникальные факторы
- Боли психолога
- 3 темы контента под нишу
- Релевантный кейс

### 3. Генерация PDF (`/api/generate-pdf`)

Система создаёт:
- **Текст для Telegram** — короткое приветствие с CTA
- **PDF-документ** — 4 страницы с персонализированным контентом

PDF генерируется через Python ReportLab с поддержкой кириллицы.

---

## 📄 Структура PDF (4 страницы)

| Страница | Содержимое |
|----------|------------|
| 1 | Обращение, профиль, почему нужен видеоконтент |
| 2 | Форматы контента, автоматизация, темы под нишу, кейс |
| 3 | Предложение, что входит, сравнение с командой |
| 4 | CTA, контакты, P.S. |

---

## 🔄 API Endpoints

### POST `/api/analyze`

Анализирует профиль психолога.

**Request:**
```json
{
  "profile": {
    "full_name": "Имя Фамилия",
    "description": "Описание деятельности..."
  }
}
```

**Response:**
```json
{
  "analysis": {
    "name": "Имя",
    "specialization": ["тревога", "депрессия"],
    "approach": "КПТ",
    "experience_years": "10+ лет",
    "article_topics": [...],
    "case_study": {...}
  }
}
```

### POST `/api/generate-pdf`

Генерирует PDF и текст для мессенджеров.

**Request:**
```json
{
  "profile": { ... },
  "analysis": { ... }
}
```

**Response:**
```json
{
  "telegram_text": "Приветственное сообщение...",
  "pdf_filename": "kp_psychologist_abc123.pdf",
  "success": true
}
```

### GET `/api/download/[filename]`

Скачивает сгенерированный PDF.

---

## 🛠 Расширение проекта

### Добавить новый блок в PDF

1. Отредактируйте `src/lib/pdf-generator.ts`
2. Добавьте новый Python-код в функцию `generatePdfScript()`
3. Используйте существующие стили или создайте новые

### Изменить промпт анализа

1. Отредактируйте `src/lib/prompts.ts`
2. Измените `ANALYSIS_PROMPT` или `SYSTEM_PROMPT_ANALYSIS`
3. При изменении структуры ответа — обновите `src/lib/types.ts`

### Добавить новый формат вывода

1. Создайте новый API route в `src/app/api/`
2. Используйте `getZai()` для вызова LLM
3. Добавьте UI компонент для отображения

---

## 📚 Технологии

| Категория | Технология |
|-----------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Backend | Next.js API Routes |
| AI/LLM | z-ai-web-dev-sdk |
| PDF | Python 3, ReportLab |
| Fonts | DejaVu Sans (кириллица) |

---

## 🤝 Участие в разработке

См. [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📝 История версий

См. [CHANGELOG.md](./CHANGELOG.md)

---

## 📄 Лицензия

MIT License — используйте свободно для коммерческих и некоммерческих проектов.

---

## 📞 Контакты

- **Сайт:** [vailite.ru](https://vailite.ru)
- **Telegram:** [@VadimCrypton](https://t.me/VadimCrypton)
