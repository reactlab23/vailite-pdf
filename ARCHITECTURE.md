# Архитектура проекта

Документ описывает архитектуру, потоки данных и ключевые решения генератора КП.

---

## 🏗 Общая архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ ProfileInput│  │ResultDisplay│  │ TelegramText + PdfDownload│  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘  │
│         │                │                                        │
│         ▼                ▼                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                      page.tsx                               │  │
│  │         (State management + API calls)                      │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Next.js API)                       │
│                                                                  │
│  ┌─────────────────┐         ┌─────────────────────┐           │
│  │  /api/analyze   │ ──────► │  /api/generate-pdf  │           │
│  │                 │         │                     │           │
│  │ • LLM анализ    │         │ • LLM текст         │           │
│  │ • Извлечение    │         │ • PDF генерация     │           │
│  │   данных        │         │ • Python ReportLab  │           │
│  └────────┬────────┘         └──────────┬──────────┘           │
│           │                             │                       │
│           ▼                             ▼                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    z-ai-web-dev-sdk                      │   │
│  │                   (LLM Integration)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Python (ReportLab)                           │
│                                                                  │
│  • Генерация PDF из Python-скрипта                              │
│  • Шрифты DejaVu для кириллицы                                  │
│  • Тёмная тема + золотые акценты                                │
│  • Кликабельные ссылки                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Поток данных

### Основной сценарий

```
Пользователь вводит JSON профиля
           │
           ▼
    ┌──────────────┐
    │  Валидация   │ ── Ошибка ──► Показать сообщение
    │   JSON       │
    └──────┬───────┘
           │ OK
           ▼
    ┌──────────────────────────────┐
    │  POST /api/analyze           │
    │                              │
    │  1. Формирование промпта     │
    │  2. Вызов LLM (z-ai-sdk)     │
    │  3. Парсинг JSON ответа      │
    │                              │
    └──────────────┬───────────────┘
                   │
                   ▼ analysis
    ┌──────────────────────────────┐
    │  POST /api/generate-pdf      │
    │                              │
    │  1. Генерация текста TG      │
    │  2. Создание Python-скрипта  │
    │  3. Выполнение Python        │
    │  4. Возврат путей            │
    │                              │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │  Отображение результата:     │
    │                              │
    │  • Текст для копирования     │
    │  • Кнопка скачивания PDF     │
    │  • Данные анализа            │
    │                              │
    └──────────────────────────────┘
```

---

## 📦 Модули

### 1. Frontend (`src/app/page.tsx`)

**Ответственность:**
- Рендеринг UI
- Управление состоянием
- Валидация ввода
- Вызовы API

**Состояние:**
```typescript
interface PageState {
  profile: string;          // JSON-строка
  loading: boolean;
  error: string | null;
  result: {
    analysis: AnalysisResult;
    telegram_text: string;
    pdf_filename: string;
  } | null;
  genState: GenerationState;  // Шаг генерации
}
```

### 2. API Analyze (`src/app/api/analyze/route.ts`)

**Ответственность:**
- Приём профиля психолога
- Формирование промпта для LLM
- Вызов z-ai-web-dev-sdk
- Парсинг ответа в AnalysisResult

**Вход:** `PsychologistProfile`
**Выход:** `AnalysisResult`

### 3. API Generate-PDF (`src/app/api/generate-pdf/route.ts`)

**Ответственность:**
- Генерация текста для мессенджеров
- Создание Python-скрипта
- Выполнение Python через child_process
- Управление файлами

**Вход:** `PsychologistProfile` + `AnalysisResult`
**Выход:** `GenerationResult`

### 4. PDF Generator (`src/lib/pdf-generator.ts`)

**Ответственность:**
- Генерация Python-скрипта для ReportLab
- Шаблон 4-страничного PDF
- Стили, цвета, шрифты

**Функция:** `generatePdfScript(data: PdfData): string`

---

## 🗂 Типы данных

### Основные интерфейсы

```typescript
// Входные данные
interface PsychologistProfile {
  full_name: string;      // Обязательно
  city?: string;
  description: string;    // Обязательно
  phone?: string;
  email?: string;
  social_links?: string[];
  profile_url?: string;
}

// Результат анализа LLM
interface AnalysisResult {
  name: string;
  specialization: string[];
  approach: string;
  experience_years: string;
  unique_factors: string[];
  pain_points: string[];
  key_insight: string;
  article_topics: ArticleTopic[];
  ps_text: string;
  case_study: CaseStudy;
}

// Тема контента
interface ArticleTopic {
  topic: string;      // "Тревожность"
  format: string;     // "экспертный ролик"
  title: string;      // "5 признаков..."
}

// Кейс
interface CaseStudy {
  name: string;
  specialization: string;
  before_followers: string;
  after_followers: string;
  before_leads: string;
  after_leads: string;
  before_time: string;
  after_time: string;
}

// Данные для PDF
interface PdfData {
  psychologist_name: string;
  psychologist_first_name: string;
  psychologist_specialization: string;
  psychologist_experience: string;
  article_topics: ArticleTopic[];
  case_study: CaseStudy;
  output_path: string;
}
```

---

## 🔧 Конфигурация

### Переменные окружения

| Переменная | Обязательно | По умолчанию | Описание |
|------------|-------------|--------------|----------|
| `ZAI_API_KEY` | Да | — | API ключ для LLM |
| `DOWNLOAD_DIR` | Нет | `/home/z/my-project/download` | Папка для PDF |
| `PYTHON_PATH` | Нет | `/home/z/my-project/venv/bin/python3` | Путь к Python |

### Пути в проекте

| Путь | Назначение |
|------|------------|
| `/download/` | Сгенерированные PDF |
| `/venv/` | Python виртуальное окружение |
| `/backup_v1/` | Backup версии 1 |
| `/backup_v2_dynamic/` | Backup версии 2 |

---

## 🎨 PDF Дизайн

### Цветовая схема

| Цвет | HEX | Использование |
|------|-----|---------------|
| DARK_BG | `#0A0A0A` | Фон |
| DARK_BG2 | `#0F1929` | Блоки |
| DARK_BG3 | `#1A2744` | Таблицы |
| GOLD | `#D4AF37` | Акценты, заголовки |
| GOLD_LIGHT | `#E8D5A3` | Подсветка |
| WHITE | `#F8F8F8` | Основной текст |

### Шрифты

- **Основной:** DejaVu Sans
- **Жирный:** DejaVu Sans-Bold
- **Поддержка:** Кириллица, латиница

### Структура страниц

| Страница | Блоки |
|----------|-------|
| 1 | Заголовок, профиль, обращение, причины |
| 2 | Форматы, автоматизация, соцсети, темы, кейс |
| 3 | Предложение, что входит, сравнение с командой |
| 4 | CTA, контакты, P.S. |

---

## 🔐 Безопасность

### Валидация

- JSON-парсинг на клиенте
- Проверка обязательных полей
- Sanitизация строк для Python

### Файлы

- Уникальные имена через UUID
- Временные скрипты удаляются
- PDF хранятся в изолированной папке

---

## 📈 Масштабирование

### Текущие ограничения

- Синхронная генерация (блокирующая)
- Нет очереди задач
- Нет кэширования

### Возможные улучшения

1. **Очередь задач** — BullMQ / Redis для фоновой генерации
2. **Кэширование** — Redis для результатов анализа
3. **База данных** — Prisma для истории генераций
4. **CDN** — S3/R2 для хранения PDF

---

## 🧪 Тестирование

### Ручное тестирование

1. Откройте http://localhost:3000
2. Введите JSON профиля (или используйте пример)
3. Нажмите "Сгенерировать КП"
4. Проверьте результат

### Тестовый профиль

```json
{
  "full_name": "Андрей Савенко",
  "city": "Москва",
  "description": "Практикующий психолог. Консультирую с 2011 года. Когнитивно-поведенческий подход. Работаю с тревогой, депрессией, паническими атаками.",
  "phone": "+7 913 380-83-42",
  "email": "example@yandex.ru"
}
```

---

## 📝 Рекомендации по расширению

### Добавить новый блок в PDF

1. Отредактируйте `src/lib/pdf-generator.ts`
2. Добавьте Python-код в `generatePdfScript()`
3. При необходимости — добавьте данные в `PdfData`

### Изменить промпт

1. Отредактируйте `src/lib/prompts.ts`
2. При изменении структуры — обновите `types.ts`
3. Проверьте парсинг в `/api/analyze`

### Добавить API endpoint

1. Создайте папку в `src/app/api/`
2. Создайте `route.ts` с функциями GET/POST
3. Используйте `getZai()` для LLM
