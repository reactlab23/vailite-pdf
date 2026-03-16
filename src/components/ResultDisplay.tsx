'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TelegramText } from './TelegramText';
import { PdfDownload } from './PdfDownload';
import { Copy, Check, Sparkles, MessageSquare, FileDown } from 'lucide-react';
import { useState } from 'react';
import type { AnalysisResult } from '@/lib/types';

interface ResultDisplayProps {
  analysis: AnalysisResult;
  telegramText: string;
  pdfFilename: string;
}

export function ResultDisplay({ analysis, telegramText, pdfFilename }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(telegramText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Анализ профиля */}
      <Card className="glass-card card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Sparkles className="h-5 w-5 text-amber-400" />
            </motion.div>
            <span className="vailite-gradient-text">Анализ профиля</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Имя:</span>
              <p className="font-semibold text-foreground">{analysis.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Опыт:</span>
              <p className="font-semibold text-foreground">{analysis.experience_years}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Подход:</span>
              <p className="font-semibold text-foreground">{analysis.approach}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Специализация:</span>
              <p className="font-semibold text-foreground">{analysis.specialization?.join(', ')}</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Выявленные боли:</span>
            <div className="flex flex-wrap gap-2">
              {analysis.pain_points?.map((pain: string, i: number) => (
                <span 
                  key={i} 
                  className="px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400"
                >
                  {pain}
                </span>
              ))}
            </div>
          </div>
          
          {analysis.key_insight && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <span className="text-xs font-bold text-amber-400">Ключевой инсайт:</span>
              <p className="text-sm mt-1 text-foreground/90">{analysis.key_insight}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Текст для Telegram */}
      <Card className="glass-card card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-amber-400" />
            <span className="vailite-gradient-text">Текст для Telegram</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopy} 
            className="shrink-0 h-8 w-8 p-0 hover:bg-amber-500/10"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <TelegramText text={telegramText} />
        </CardContent>
      </Card>

      {/* Скачать PDF */}
      <Card className="glass-card card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileDown className="h-5 w-5 text-amber-400" />
            <span className="vailite-gradient-text">Коммерческое предложение</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PdfDownload filename={pdfFilename} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
