'use client';

import { Textarea } from '@/components/ui/textarea';

interface ProfileInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProfileInput({ value, onChange }: ProfileInputProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='{"full_name": "Имя Фамилия", "city": "Москва", "description": "Описание...", ...}'
      className="font-mono text-sm min-h-[200px] md:min-h-[280px] resize-y bg-muted/30 border-amber-500/20 focus:border-amber-500/40 focus:ring-amber-500/20 placeholder:text-muted-foreground/50"
    />
  );
}
