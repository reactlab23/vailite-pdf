'use client';

interface TelegramTextProps {
  text: string;
}

export function TelegramText({ text }: TelegramTextProps) {
  return (
    <div className="bg-muted/30 rounded-xl p-4 text-sm whitespace-pre-wrap font-sans leading-relaxed border border-amber-500/10">
      {text}
    </div>
  );
}
