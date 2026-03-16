'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProfileInput } from '@/components/ProfileInput';
import { ResultDisplay } from '@/components/ResultDisplay';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, Sparkles, AlertCircle, RefreshCw, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import type { AnalysisResult, PsychologistProfile } from '@/lib/types';

// Пример профиля для быстрого тестирования
const EXAMPLE_PROFILE: PsychologistProfile = {
  full_name: "Андрей Савенко",
  city: "Москва",
  description: "Практикующий психолог. Консультирую с 2011 года. Когнитивно-поведенческий подход. Работаю с тревогой, депрессией, паническими атаками, зависимостями.",
  phone: "+7 913 380-83-42",
  email: "example@yandex.ru",
  social_links: [
    "https://t.me/+79133808342",
    "https://vk.com/example"
  ],
  profile_url: "https://www.b17.ru/example/"
};

interface GenerationState {
  step: 'idle' | 'analyzing' | 'generating' | 'done';
  message: string;
}

// Компонент печатающегося текста
function TypewriterText({ text, delay = 30 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-0.5 h-4 bg-amber-400 ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

export default function Home() {
  const [profile, setProfile] = useState<string>(JSON.stringify(EXAMPLE_PROFILE, null, 2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    analysis: AnalysisResult;
    telegram_text: string;
    pdf_filename: string;
  } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [genState, setGenState] = useState<GenerationState>({ step: 'idle', message: '' });

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setGenState({ step: 'analyzing', message: 'Анализирую профиль психолога...' });

    try {
      // Парсим профиль
      let parsedProfile: PsychologistProfile;
      try {
        parsedProfile = JSON.parse(profile);
      } catch {
        throw new Error('Неверный формат JSON. Проверьте синтаксис.');
      }

      if (!parsedProfile.full_name || !parsedProfile.description) {
        throw new Error('Обязательные поля: full_name, description');
      }

      // Шаг 1: Анализ профиля
      setGenState({ step: 'analyzing', message: 'Анализирую профиль через AI...' });
      
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: parsedProfile })
      });

      if (!analyzeRes.ok) {
        const errData = await analyzeRes.json();
        throw new Error(errData.error || 'Ошибка анализа профиля');
      }

      const { analysis } = await analyzeRes.json();

      // Шаг 2: Генерация PDF и текста
      setGenState({ step: 'generating', message: 'Генерирую PDF и текст для мессенджеров...' });
      
      const generateRes = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: parsedProfile, analysis })
      });

      if (!generateRes.ok) {
        const errData = await generateRes.json();
        throw new Error(errData.error || 'Ошибка генерации PDF');
      }

      const generateData = await generateRes.json();

      setResult({
        analysis,
        telegram_text: generateData.telegram_text,
        pdf_filename: generateData.pdf_filename
      });
      
      setGenState({ step: 'done', message: 'Готово!' });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      setGenState({ step: 'idle', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setGenState({ step: 'idle', message: '' });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8 md:py-12">
        {/* Заголовок */}
        <div className="text-center mb-8">
          {/* Логотип Vailite */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-14 h-14 rounded-xl overflow-hidden shadow-lg shadow-amber-500/20 mx-auto mb-4"
          >
            <img 
              src="/vailite-logo.jpeg" 
              alt="Vailite" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Иконка и заголовок */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="w-14 h-14 rounded-2xl vailite-gradient flex items-center justify-center shadow-lg shadow-amber-500/20"
            >
              <FileText className="w-7 h-7 text-black" />
            </motion.div>
            <h1 className="text-xl md:text-2xl font-bold vailite-gradient-text text-left leading-tight">
              Генератор КП<br/>для психологов
            </h1>
          </div>
          
          <p className="text-muted-foreground text-sm md:text-base max-w-sm mx-auto leading-relaxed">
            <TypewriterText 
              text="Создайте персонализированное коммерческое предложение за 30 секунд. AI проанализирует профиль и сгенерирует готовый PDF." 
              delay={25}
            />
          </p>
        </div>

        {/* Форма ввода */}
        <Card className="glass-card card-hover mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground">Данные психолога (JSON)</CardTitle>
            <CardDescription className="text-muted-foreground">
              Введите данные в формате JSON или используйте пример
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileInput value={profile} onChange={setProfile} />
            
            <div className="mt-4 flex flex-col gap-3">
              <Button 
                onClick={handleGenerate} 
                disabled={loading}
                className="h-14 rounded-2xl vailite-gradient text-black font-bold text-lg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {genState.message}
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Сгенерировать КП
                  </>
                )}
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setProfile(JSON.stringify(EXAMPLE_PROFILE, null, 2))}
                  disabled={loading}
                  className="flex-1 h-12 rounded-xl border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                >
                  Пример
                </Button>
                
                {result && (
                  <Button 
                    variant="ghost"
                    onClick={handleReset}
                    disabled={loading}
                    className="h-12 rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Сбросить
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Подсказка по формату */}
        <Button
          variant="ghost"
          className="mb-4 w-full justify-between text-muted-foreground hover:text-foreground"
          onClick={() => setShowHelp(!showHelp)}
        >
          <span>Формат JSON</span>
          {showHelp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {showHelp && (
          <Card className="glass-card mb-6">
            <CardContent className="pt-4">
              <pre className="text-xs md:text-sm overflow-x-auto font-mono text-muted-foreground">
{`{
  "full_name": "Имя Фамилия (обязательно)",
  "city": "Город",
  "description": "Описание деятельности (обязательно)",
  "phone": "Телефон",
  "email": "Email",
  "social_links": ["ссылка 1", "ссылка 2"],
  "profile_url": "URL профиля"
}`}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Ошибка */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Результат */}
        {result && (
          <ResultDisplay
            analysis={result.analysis}
            telegramText={result.telegram_text}
            pdfFilename={result.pdf_filename}
          />
        )}

        {/* Футер */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            Генератор КП для психологов • Powered by AI
          </p>
        </footer>
      </div>
    </main>
  );
}
