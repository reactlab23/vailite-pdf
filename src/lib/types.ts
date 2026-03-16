// Профиль психолога
export interface PsychologistProfile {
  full_name: string;
  city?: string;
  description: string;
  phone?: string;
  email?: string;
  social_links?: string[];
  profile_url?: string;
}

// Тема статьи/контента
export interface ArticleTopic {
  topic: string;        // Тема: "Тревожность"
  format: string;       // Формат: "экспертный ролик", "карусель", "PDF-гайд"
  title: string;        // Заголовок: "5 признаков, что тревога управляет вами"
}

// Кейс для PDF
export interface CaseStudy {
  name: string;              // Имя: "Елена"
  specialization: string;    // Специализация кейса: "тревога, депрессия, отношения"
  before_followers: string;  // "300 подписчиков"
  after_followers: string;   // "4 500 подписчиков (+1400%)"
  before_leads: string;      // "2-3 заявки в месяц"
  after_leads: string;       // "15-20 заявок в месяц"
  before_time: string;       // "Нет времени на контент"
  after_time: string;        // "Всё делает команда Vailite"
}

// Результат анализа от LLM
export interface AnalysisResult {
  name: string;                          // Имя: "Андрей"
  specialization: string[];              // ["тревога", "депрессия"]
  approach: string;                      // "КПТ с домашними заданиями"
  experience_years: string;              // "13+ лет"
  unique_factors: string[];              // ["даёт конкретные инструменты"]
  pain_points: string[];                 // ["нет времени на контент"]
  key_insight: string;                   // Инсайт о связи подхода с маркетингом
  article_topics: ArticleTopic[];        // 3 темы контента
  ps_text: string;                       // P.S. для КП
  case_study: CaseStudy;                 // Кейс
}

// Данные для генерации PDF
export interface PdfData {
  psychologist_name: string;           // Полное имя: "Андрей Савенко"
  psychologist_first_name: string;     // Имя для обращения: "Андрей"
  psychologist_specialization: string; // Специализация строкой: "тревожность, отношения"
  psychologist_experience: string;     // Опыт: "5+ лет"
  article_topics: ArticleTopic[];      // 3 темы контента
  case_study: CaseStudy;               // Кейс
  output_path: string;
}

// Результат генерации
export interface GenerationResult {
  telegram_text: string;
  pdf_filename: string;
  pdf_path: string;
  success: boolean;
}

// Web Search результат
export interface SearchResult {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
  rank: number;
  date: string;
  favicon: string;
}
