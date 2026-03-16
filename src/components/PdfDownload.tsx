'use client';

import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

interface PdfDownloadProps {
  filename: string;
}

export function PdfDownload({ filename }: PdfDownloadProps) {
  const handleDownload = () => {
    window.open(`/api/download/${filename}`, '_blank');
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <FileText className="h-5 w-5 text-amber-400" />
        </div>
        <span className="text-sm font-medium break-all">{filename}</span>
      </div>
      <Button 
        onClick={handleDownload} 
        className="sm:ml-auto shrink-0 h-12 px-5 rounded-xl vailite-gradient text-black font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
      >
        <Download className="h-4 w-4 mr-2" />
        Скачать PDF
      </Button>
    </div>
  );
}
