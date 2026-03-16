import { NextRequest, NextResponse } from 'next/server';
import { getZai } from '@/lib/zai';
import { SYSTEM_PROMPT_GREETING } from '@/lib/prompts';
import { generatePdfScript } from '@/lib/pdf-generator';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import type { PsychologistProfile, AnalysisResult, PdfData, CaseStudy, ArticleTopic } from '@/lib/types';

const execAsync = promisify(exec);

const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || '/home/z/my-project/download';
const PYTHON_PATH = process.env.PYTHON_PATH || '/home/z/my-project/venv/bin/python3';

// Дефолтный кейс на случай, если LLM не сгенерировал
const DEFAULT_CASE_STUDY: CaseStudy = {
  name: 'Елена',
  specialization: 'тревога, депрессия, отношения',
  before_followers: '300 подписчиков',
  after_followers: '4 500 подписчиков (+1400%)',
  before_leads: '2-3 заявки в месяц',
  after_leads: '15-20 заявок в месяц',
  before_time: 'Нет времени на контент',
  after_time: 'Всё делает команда Vailite'
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile = body.profile as PsychologistProfile;
    const analysis = body.analysis as AnalysisResult;

    if (!profile || !analysis) {
      return NextResponse.json(
        { error: 'Профиль и анализ обязательны' },
        { status: 400 }
      );
    }

    const zai = await getZai();

    // 1. Генерируем текст для Telegram
    const specializationStr = analysis.specialization?.join(', ') || 'психология';
    const painPoint = analysis.pain_points?.[0] || 'привлечение клиентов';

    const greetingPrompt = `Напиши короткое приветствие для Telegram (до 500 символов) для психолога ${analysis.name}.

Специализация: ${specializationStr}
Подход: ${analysis.approach || 'интегративный'}
Ключевая боль: ${painPoint}

СТРУКТУРА:
1. Комплимент подходу (1 предложение)
2. Указание на изучение профиля (1 предложение)
3. One-sentence pain (клиенты не находят)
4. Предложение ценности (КП под вашу практику)
5. CTA (ознакомиться / ответить)

ТРЕБОВАНИЯ:
- Без манипуляций
- Без маркетингового сленга
- Персонализированно
- Кратко (до 500 символов)
- Этично`;

    const greetingCompletion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT_GREETING
        },
        {
          role: 'user',
          content: greetingPrompt
        }
      ],
      temperature: 0.8
    });

    const telegramText = greetingCompletion.choices[0]?.message?.content || '';

    // 2. Генерируем PDF
    const pdfId = uuidv4();
    const pdfFilename = `kp_psychologist_${pdfId.slice(0, 8)}.pdf`;
    const pdfPath = path.join(DOWNLOAD_DIR, pdfFilename);

    // Извлекаем имя для обращения (первое слово из name)
    const firstName = analysis.name?.split(' ')[0] || analysis.name || 'Психолог';
    
    // Объединяем специализацию в строку
    const specialization = analysis.specialization?.join(', ') || 'психология';

    // Подготавливаем article_topics (максимум 3)
    const articleTopics: ArticleTopic[] = (analysis.article_topics || []).slice(0, 3);

    // Подготавливаем кейс (если нет — используем дефолтный)
    const caseStudy: CaseStudy = analysis.case_study || DEFAULT_CASE_STUDY;

    // Генерируем Python-скрипт с новой структурой PDF
    const pythonScript = generatePdfScript({
      psychologist_name: profile.full_name,
      psychologist_first_name: firstName,
      psychologist_specialization: specialization,
      psychologist_experience: analysis.experience_years || '5+ лет',
      article_topics: articleTopics,
      case_study: caseStudy,
      output_path: pdfPath
    } as PdfData);

    // Сохраняем и выполняем скрипт
    const scriptPath = path.join(DOWNLOAD_DIR, `script_${pdfId}.py`);
    await fs.writeFile(scriptPath, pythonScript, 'utf-8');
    
    const { stdout, stderr } = await execAsync(`${PYTHON_PATH} ${scriptPath}`);
    
    if (stderr && !stderr.includes('success')) {
      console.error('PDF generation stderr:', stderr);
    }

    // Проверяем, что файл создан
    try {
      await fs.access(pdfPath);
    } catch {
      throw new Error('PDF файл не был создан');
    }

    // Удаляем временный скрипт
    await fs.unlink(scriptPath).catch(() => {});

    return NextResponse.json({
      telegram_text: telegramText,
      pdf_filename: pdfFilename,
      pdf_path: pdfPath,
      success: true
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Ошибка при генерации PDF', details: String(error) },
      { status: 500 }
    );
  }
}
