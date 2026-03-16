import { NextRequest, NextResponse } from 'next/server';
import { getZai } from '@/lib/zai';
import { ANALYSIS_PROMPT, SYSTEM_PROMPT_ANALYSIS } from '@/lib/prompts';
import type { PsychologistProfile } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile = body.profile as PsychologistProfile;

    if (!profile || !profile.full_name) {
      return NextResponse.json(
        { error: 'Профиль психолога обязателен (required field: full_name)' },
        { status: 400 }
      );
    }

    const zai = await getZai();

    // Формируем промпт для анализа
    const prompt = ANALYSIS_PROMPT.replace('{PROFILE}', JSON.stringify(profile, null, 2));

    // Вызываем LLM
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT_ANALYSIS
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Парсим JSON из ответа
    let analysis;
    try {
      // Убираем возможные markdown-обертки
      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse LLM response:', responseText);
      return NextResponse.json(
        { error: 'Ошибка парсинга ответа LLM', raw: responseText },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Ошибка при анализе профиля', details: String(error) },
      { status: 500 }
    );
  }
}
