import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || '/home/z/my-project/download';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Декодируем URL-encoded имя файла
    const decodedFilename = decodeURIComponent(filename);
    
    // Безопасность: проверяем, что filename не содержит path traversal
    if (decodedFilename.includes('..') || decodedFilename.includes('/') || decodedFilename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const filePath = path.join(DOWNLOAD_DIR, decodedFilename);
    
    // Проверяем существование файла
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);
    
    // Используем ASCII имя для заголовка (транслитерация не требуется, 
    // используем RFC 5987 для поддержки Unicode)
    const asciiFilename = `kp_${Date.now()}.pdf`;
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(decodedFilename)}`,
        'Content-Length': String(fileBuffer.length)
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Ошибка при скачивании' },
      { status: 500 }
    );
  }
}
