import type { PdfData, ArticleTopic, CaseStudy } from './types';

export function generatePdfScript(data: PdfData): string {
  // Экранируем специальные символы для Python-строки
  const escapePyString = (str: string) => str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '<br/>');

  const psychologistName = escapePyString(data.psychologist_name);
  const psychologistFirstName = escapePyString(data.psychologist_first_name);
  const specialization = escapePyString(data.psychologist_specialization);
  const experience = escapePyString(data.psychologist_experience);
  const outputPath = escapePyString(data.output_path);

  // Формируем темы контента
  const topics = data.article_topics || [];
  const topic1 = topics[0] || { topic: 'Тема 1', format: 'экспертный ролик', title: 'Заголовок 1' };
  const topic2 = topics[1] || { topic: 'Тема 2', format: 'карусель', title: 'Заголовок 2' };
  const topic3 = topics[2] || { topic: 'Тема 3', format: 'PDF-гайд', title: 'Заголовок 3' };

  // Кейс
  const caseStudy = data.case_study || {
    name: 'Елена',
    specialization: 'тревога, депрессия, отношения',
    before_followers: '300 подписчиков',
    after_followers: '4 500 подписчиков (+1400%)',
    before_leads: '2-3 заявки в месяц',
    after_leads: '15-20 заявок в месяц',
    before_time: 'Нет времени на контент',
    after_time: 'Всё делает команда Vailite'
  };

  return `# -*- coding: utf-8 -*-
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# Register fonts
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans-Bold')

# Vailite colors
DARK_BG = colors.HexColor('#0A0A0A')
DARK_BG2 = colors.HexColor('#0F1929')
DARK_BG3 = colors.HexColor('#1A2744')
GOLD = colors.HexColor('#D4AF37')
GOLD_LIGHT = colors.HexColor('#E8D5A3')
WHITE = colors.HexColor('#F8F8F8')

# Styles
title_style = ParagraphStyle(
    'Title',
    fontName='DejaVuSans-Bold',
    fontSize=24,
    textColor=GOLD,
    alignment=TA_CENTER,
    spaceAfter=15,
    leading=30
)

subtitle_style = ParagraphStyle(
    'Subtitle',
    fontName='DejaVuSans',
    fontSize=14,
    textColor=WHITE,
    alignment=TA_CENTER,
    spaceAfter=10,
    leading=20
)

heading_style = ParagraphStyle(
    'Heading',
    fontName='DejaVuSans-Bold',
    fontSize=16,
    textColor=GOLD,
    alignment=TA_LEFT,
    spaceBefore=20,
    spaceAfter=12,
    leading=22
)

body_style = ParagraphStyle(
    'Body',
    fontName='DejaVuSans',
    fontSize=11,
    textColor=WHITE,
    alignment=TA_LEFT,
    spaceAfter=10,
    leading=17
)

highlight_style = ParagraphStyle(
    'Highlight',
    fontName='DejaVuSans-Bold',
    fontSize=12,
    textColor=GOLD_LIGHT,
    alignment=TA_LEFT,
    spaceAfter=8,
    leading=18
)

small_style = ParagraphStyle(
    'Small',
    fontName='DejaVuSans',
    fontSize=10,
    textColor=colors.HexColor('#AAAAAA'),
    alignment=TA_LEFT,
    spaceAfter=8,
    leading=14
)

# Data
PSYCHOLOGIST_NAME = "${psychologistName}"
PSYCHOLOGIST_FIRST_NAME = "${psychologistFirstName}"
SPECIALIZATION = "${specialization}"
EXPERIENCE = "${experience}"
OUTPUT_PATH = "${outputPath}"

# Article topics (динамические)
TOPIC_1 = "${escapePyString(topic1.topic)}"
TOPIC_1_FORMAT = "${escapePyString(topic1.format)}"
TOPIC_1_TITLE = "${escapePyString(topic1.title)}"
TOPIC_2 = "${escapePyString(topic2.topic)}"
TOPIC_2_FORMAT = "${escapePyString(topic2.format)}"
TOPIC_2_TITLE = "${escapePyString(topic2.title)}"
TOPIC_3 = "${escapePyString(topic3.topic)}"
TOPIC_3_FORMAT = "${escapePyString(topic3.format)}"
TOPIC_3_TITLE = "${escapePyString(topic3.title)}"

# Case study (динамический)
CASE_NAME = "${escapePyString(caseStudy.name)}"
CASE_SPECIALIZATION = "${escapePyString(caseStudy.specialization)}"
CASE_BEFORE_FOLLOWERS = "${escapePyString(caseStudy.before_followers)}"
CASE_AFTER_FOLLOWERS = "${escapePyString(caseStudy.after_followers)}"
CASE_BEFORE_LEADS = "${escapePyString(caseStudy.before_leads)}"
CASE_AFTER_LEADS = "${escapePyString(caseStudy.after_leads)}"
CASE_BEFORE_TIME = "${escapePyString(caseStudy.before_time)}"
CASE_AFTER_TIME = "${escapePyString(caseStudy.after_time)}"

# Create PDF
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

doc = SimpleDocTemplate(
    OUTPUT_PATH,
    pagesize=A4,
    leftMargin=1.5*cm,
    rightMargin=1.5*cm,
    topMargin=1.5*cm,
    bottomMargin=1.5*cm
)

page_width = A4[0] - 3*cm

story = []

# ========== СТРАНИЦА 1 ==========
# БЛОК 1: Заголовок
story.append(Spacer(1, 15))
story.append(Paragraph("Персональное коммерческое предложение", subtitle_style))
story.append(Spacer(1, 5))

# БЛОК 2: Сводка профиля
profile_data = [[Paragraph(
    f'<b>Психолог • {PSYCHOLOGIST_NAME}</b><br/>'
    f'Специализация: {SPECIALIZATION}<br/>'
    f'Опыт: {EXPERIENCE}',
    ParagraphStyle('profile', fontName='DejaVuSans', fontSize=11, textColor=WHITE, alignment=TA_CENTER, leading=16)
)]]
profile_table = Table(profile_data, colWidths=[page_width*0.8])
profile_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), DARK_BG3),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 15),
    ('RIGHTPADDING', (0, 0), (-1, -1), 15),
    ('TOPPADDING', (0, 0), (-1, -1), 12),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
    ('BOX', (0, 0), (-1, -1), 1, GOLD),
]))
story.append(profile_table)
story.append(Spacer(1, 15))

# БЛОК 3: Персональное обращение
story.append(Paragraph(
    f"{PSYCHOLOGIST_FIRST_NAME}, мы проанализировали ваш профиль и видим большой потенциал для роста через "
    "видеоконтент. Ваша экспертность и манера общения идеально подходят для формата "
    "коротких видео — вы умеете говорить о сложном простым языком.",
    body_style
))
story.append(Spacer(1, 20))

# БЛОК 4: Почему ролики
story.append(Paragraph("Почему психологу нужен видеоконтент сейчас", heading_style))
story.append(Paragraph(
    "Рынок психологических услуг кардинально изменился. В 2026 году 78% клиентов ищут специалиста "
    "через соцсети, просматривая видеоконтент перед записью на консультацию. Психологи без "
    "видеоприсутствия теряют до 60% потенциальных клиентов.",
    body_style
))
story.append(Spacer(1, 8))
story.append(Paragraph(
    "Вертикальные видео на YouTube Shorts, Reels и TikTok получают в 3 раза больше охватов, "
    "чем традиционные посты. Клиенты хотят «увидеть» психолога до первой встречи — голос, "
    "манеру общения, подход к работе. Это создаёт доверие ещё до первого звонка.",
    body_style
))
story.append(Spacer(1, 20))

# БЛОК 5: Проблемы
story.append(Paragraph("С какими проблемами сталкиваются психологи", heading_style))
problems_data = [
    [Paragraph('•', ParagraphStyle('icon', fontName='DejaVuSans', fontSize=12, textColor=GOLD, alignment=TA_CENTER)),
     Paragraph('Нет времени на соцсети — вся энергия уходит на клиентов', body_style)],
    [Paragraph('•', ParagraphStyle('icon', fontName='DejaVuSans', fontSize=12, textColor=GOLD, alignment=TA_CENTER)),
     Paragraph('Непонятно, о чём снимать и как это монетизировать', body_style)],
    [Paragraph('•', ParagraphStyle('icon', fontName='DejaVuSans', fontSize=12, textColor=GOLD, alignment=TA_CENTER)),
     Paragraph('Контент есть, но клиенты не приходят — нет системы', body_style)],
    [Paragraph('•', ParagraphStyle('icon', fontName='DejaVuSans', fontSize=12, textColor=GOLD, alignment=TA_CENTER)),
     Paragraph('Страх камеры и непонимание технической части', body_style)],
]
problems_table = Table(problems_data, colWidths=[0.8*cm, page_width - 0.8*cm])
problems_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
]))
story.append(problems_table)
story.append(Spacer(1, 20))

# БЛОК 6: Инсайт
story.append(Paragraph("Инсайт", heading_style))
insight_text = (
    "Проблема не в том, что вы «не умеете» вести соцсети. "
    "Проблема в том, что это требует команды из 4 специалистов. "
    "Мы даём вам такую команду — за часть стоимости."
)
story.append(Paragraph(insight_text, body_style))

# ========== СТРАНИЦА 2 ==========
# БЛОК 7: Что получите
story.append(Spacer(1, 25))
story.append(Paragraph("Что вы получите", heading_style))

# Content formats table
formats_data = [
    [Paragraph('<b>Формат</b>', ParagraphStyle('th', fontName='DejaVuSans-Bold', fontSize=10, textColor=DARK_BG, alignment=TA_CENTER)),
     Paragraph('<b>Для чего</b>', ParagraphStyle('th', fontName='DejaVuSans-Bold', fontSize=10, textColor=DARK_BG, alignment=TA_CENTER))],
    [Paragraph('Экспертные ролики (от 30 сек)', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT)),
     Paragraph('Демонстрация экспертности, доверие', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT))],
    [Paragraph('Вирусные ролики (8-15 сек)', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT)),
     Paragraph('Охваты, узнаваемость, рост подписчиков', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT))],
    [Paragraph('Карусели', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT)),
     Paragraph('Пошаговые инструкции, чек-листы', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT))],
    [Paragraph('PDF-лидмагниты', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT)),
     Paragraph('Сбор контактов, warming аудитории', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT))],
    [Paragraph('Посты', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT)),
     Paragraph('Глубокий контент, SEO, экспертность', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT))],
]
formats_table = Table(formats_data, colWidths=[page_width*0.45, page_width*0.55])
formats_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), GOLD),
    ('BACKGROUND', (0, 1), (-1, -1), DARK_BG3),
    ('GRID', (0, 0), (-1, -1), 0.5, GOLD),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(formats_table)
story.append(Spacer(1, 20))

# БЛОК 8: Автоматизация
story.append(Paragraph("Автоматизация и лидогенерация", heading_style))
story.append(Paragraph(
    "• Автоответчики в Telegram и Instagram — моментальная реакция на заявки<br/>"
    "• Сбор лидов через встроенные формы и лид-магниты<br/>"
    "• Еженедельные отчёты по охватам, вовлечённости и конверсиям",
    body_style
))
story.append(Spacer(1, 20))

# БЛОК 9: Где бренд (6 соцсетей)
story.append(Paragraph("6 социальных сетей для вашего бренда", heading_style))
story.append(Paragraph(
    "Telegram • VK • YouTube Shorts • Instagram • TikTok • LinkedIn",
    highlight_style
))
story.append(Paragraph(
    "Ваш контент публикуется одновременно на всех шести площадках. Мы адаптируем форматы "
    "под особенности каждой соцсети.",
    body_style
))
story.append(Spacer(1, 20))

# БЛОК 10: Темы (динамические)
story.append(Paragraph("Темы контента для вашей ниши", heading_style))
themes_data = [
    [Paragraph(f'• {TOPIC_1}', ParagraphStyle('theme', fontName='DejaVuSans-Bold', fontSize=10, textColor=GOLD_LIGHT, alignment=TA_LEFT)),
     Paragraph(f'"{TOPIC_1_TITLE}" — {TOPIC_1_FORMAT}', small_style)],
    [Paragraph(f'• {TOPIC_2}', ParagraphStyle('theme', fontName='DejaVuSans-Bold', fontSize=10, textColor=GOLD_LIGHT, alignment=TA_LEFT)),
     Paragraph(f'"{TOPIC_2_TITLE}" — {TOPIC_2_FORMAT}', small_style)],
    [Paragraph(f'• {TOPIC_3}', ParagraphStyle('theme', fontName='DejaVuSans-Bold', fontSize=10, textColor=GOLD_LIGHT, alignment=TA_LEFT)),
     Paragraph(f'"{TOPIC_3_TITLE}" — {TOPIC_3_FORMAT}', small_style)],
]
themes_table = Table(themes_data, colWidths=[page_width*0.25, page_width*0.75])
themes_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(themes_table)
story.append(Spacer(1, 20))

# БЛОК 11: Кейс (динамический)
story.append(Paragraph(f"Кейс: Психолог {CASE_NAME}", heading_style))
case_data = [
    [Paragraph('<b>До Vailite:</b>', ParagraphStyle('case', fontName='DejaVuSans-Bold', fontSize=10, textColor=WHITE, alignment=TA_LEFT)),
     Paragraph('<b>После 3 месяцев:</b>', ParagraphStyle('case', fontName='DejaVuSans-Bold', fontSize=10, textColor=GOLD, alignment=TA_LEFT))],
    [Paragraph(CASE_BEFORE_FOLLOWERS, small_style),
     Paragraph(CASE_AFTER_FOLLOWERS, ParagraphStyle('case', fontName='DejaVuSans', fontSize=10, textColor=GOLD_LIGHT, alignment=TA_LEFT))],
    [Paragraph(CASE_BEFORE_LEADS, small_style),
     Paragraph(CASE_AFTER_LEADS, ParagraphStyle('case', fontName='DejaVuSans', fontSize=10, textColor=GOLD_LIGHT, alignment=TA_LEFT))],
    [Paragraph(CASE_BEFORE_TIME, small_style),
     Paragraph(CASE_AFTER_TIME, ParagraphStyle('case', fontName='DejaVuSans', fontSize=10, textColor=GOLD_LIGHT, alignment=TA_LEFT))],
]
case_table = Table(case_data, colWidths=[page_width*0.5, page_width*0.5])
case_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), DARK_BG3),
    ('GRID', (0, 0), (-1, -1), 0.5, GOLD),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(case_table)

# ========== СТРАНИЦА 3 ==========
# БЛОК 12: Предложение
story.append(Spacer(1, 25))
story.append(Paragraph("Ваше предложение", heading_style))

price_data = [[Paragraph(
    '<b>от 25 000 ₽/мес</b><br/><br/>'
    'Полный цикл производства контента для 6 соцсетей<br/>'
    'Включая автоматизацию и аналитику',
    ParagraphStyle('price', fontName='DejaVuSans', fontSize=18, textColor=DARK_BG, alignment=TA_CENTER, leading=26)
)]]
price_table = Table(price_data, colWidths=[page_width*0.75])
price_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), GOLD),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 20),
    ('RIGHTPADDING', (0, 0), (-1, -1), 20),
    ('TOPPADDING', (0, 0), (-1, -1), 18),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 18),
]))
story.append(price_table)
story.append(Spacer(1, 25))

# БЛОК 13: Что входит
story.append(Paragraph("Что входит в стоимость", heading_style))
includes_text = (
    "• Съёмка экспертных роликов<br/>"
    "• Монтаж и оформление всех видео<br/>"
    "• Создание каруселей и постов<br/>"
    "• PDF-лидмагниты под ваши темы<br/>"
    "• Публикация в 6 соцсетях<br/>"
    "• Настройка автоответчиков<br/>"
    "• Еженедельная аналитика и отчёты<br/>"
    "• Персональный менеджер"
)
story.append(Paragraph(includes_text, body_style))
story.append(Spacer(1, 25))

# БЛОК 14: Сравнение с командой
story.append(Paragraph("Сравните с наймом команды", heading_style))

team_data = [
    [Paragraph('<b>Специалист</b>', ParagraphStyle('th', fontName='DejaVuSans-Bold', fontSize=10, textColor=DARK_BG, alignment=TA_LEFT)),
     Paragraph('<b>Зарплата</b>', ParagraphStyle('th', fontName='DejaVuSans-Bold', fontSize=10, textColor=DARK_BG, alignment=TA_CENTER))],
    [Paragraph('SMM-менеджер', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT)),
     Paragraph('60 000 ₽', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_CENTER))],
    [Paragraph('Видеограф', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT)),
     Paragraph('80 000 ₽', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_CENTER))],
    [Paragraph('Монтажёр', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT)),
     Paragraph('50 000 ₽', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_CENTER))],
    [Paragraph('Копирайтер', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_LEFT)),
     Paragraph('40 000 ₽', ParagraphStyle('td', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_CENTER))],
    [Paragraph('<b>Итого команда</b>', ParagraphStyle('td', fontName='DejaVuSans-Bold', fontSize=10, textColor=GOLD, alignment=TA_LEFT)),
     Paragraph('<b>230 000 ₽/мес</b>', ParagraphStyle('td', fontName='DejaVuSans-Bold', fontSize=10, textColor=GOLD, alignment=TA_CENTER))],
    [Paragraph('<b>Vailite.ru</b>', ParagraphStyle('td', fontName='DejaVuSans-Bold', fontSize=10, textColor=colors.HexColor('#4CAF50'), alignment=TA_LEFT)),
     Paragraph('<b>от 25 000 ₽/мес</b>', ParagraphStyle('td', fontName='DejaVuSans-Bold', fontSize=10, textColor=colors.HexColor('#4CAF50'), alignment=TA_CENTER))],
]

team_table = Table(team_data, colWidths=[page_width*0.6, page_width*0.4])
team_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), GOLD),
    ('BACKGROUND', (0, 1), (-1, 4), DARK_BG3),
    ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#2A3754')),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#1A2744')),
    ('GRID', (0, 0), (-1, -1), 0.5, GOLD),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ('TOPPADDING', (0, 0), (-1, -1), 7),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
]))
story.append(team_table)

# Savings highlight
story.append(Spacer(1, 12))
savings_data = [[Paragraph(
    '<b>Экономия: до 205 000 ₽/мес</b>',
    ParagraphStyle('savings', fontName='DejaVuSans-Bold', fontSize=13, textColor=DARK_BG, alignment=TA_CENTER)
)]]
savings_table = Table(savings_data, colWidths=[page_width*0.55])
savings_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), GOLD),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ('TOPPADDING', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
]))
story.append(savings_table)

# ========== СТРАНИЦА 4 ==========
# БЛОК 15: CTA
story.append(Spacer(1, 25))
story.append(Paragraph("Готовы начать?", heading_style))
story.append(Paragraph(
    "Запишитесь на бесплатную консультацию — обсудим вашу ситуацию и подберём оптимальный формат работы.",
    ParagraphStyle('cta', fontName='DejaVuSans', fontSize=12, textColor=GOLD_LIGHT, alignment=TA_CENTER, leading=18)
))
story.append(Spacer(1, 20))

# БЛОК 16: Контакты - кликабельные кнопки
story.append(Paragraph("Свяжитесь с нами", heading_style))
story.append(Spacer(1, 8))

# Telegram button - кликабельный
telegram_data = [[Paragraph(
    '<b><a href="https://t.me/VadimCrypton" color="#0A0A0A">Запись на онлайн-звонок</a></b>',
    ParagraphStyle('btn', fontName='DejaVuSans-Bold', fontSize=12, textColor=DARK_BG, alignment=TA_CENTER, leading=18)
)]]
telegram_table = Table(telegram_data, colWidths=[page_width*0.45])
telegram_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), GOLD),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ('TOPPADDING', (0, 0), (-1, -1), 12),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
]))

# Website button - кликабельный
website_data = [[Paragraph(
    '<b><a href="https://vailite.ru/" color="#0A0A0A">Сайт vailite.ru</a></b>',
    ParagraphStyle('btn', fontName='DejaVuSans-Bold', fontSize=12, textColor=DARK_BG, alignment=TA_CENTER, leading=18)
)]]
website_table = Table(website_data, colWidths=[page_width*0.45])
website_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), GOLD),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ('TOPPADDING', (0, 0), (-1, -1), 12),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
]))

# Side by side buttons
buttons_row = Table([[telegram_table, website_table]], colWidths=[page_width*0.5, page_width*0.5])
buttons_row.setStyle(TableStyle([
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
]))
story.append(buttons_row)
story.append(Spacer(1, 12))

# Контакт для связи (если ссылка не работает)
contact_text = "Telegram: @VadimCrypton (если переход не работает — напишите напрямую)"
story.append(Paragraph(contact_text, ParagraphStyle('contact', fontName='DejaVuSans', fontSize=9, textColor=colors.HexColor('#AAAAAA'), alignment=TA_CENTER, leading=14)))
story.append(Spacer(1, 20))

# БЛОК 17: P.S. (захардкоженный)
ps_data = [[Paragraph(
    '<b>P.S.</b> Специально для психологов — скидка 20% на первый месяц при оплате в течение 3 дней после консультации. '
    'Это наше вложение в ваше доверие.',
    ParagraphStyle('ps', fontName='DejaVuSans', fontSize=10, textColor=colors.HexColor('#AAAAAA'), alignment=TA_LEFT, leading=15)
)]]
ps_table = Table(ps_data, colWidths=[page_width])
ps_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), DARK_BG2),
    ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ('TOPPADDING', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
]))
story.append(ps_table)

# Build PDF with dark background
def draw_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(DARK_BG)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.restoreState()

doc.build(story, onFirstPage=draw_background, onLaterPages=draw_background)

print("PDF created successfully!")
`;
}
