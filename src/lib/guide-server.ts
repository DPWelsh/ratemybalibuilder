import fs from 'fs';
import path from 'path';
import { Chapter } from './guide';

export async function getChapterContent(chapter: Chapter): Promise<string> {
  const filePath = path.join(process.cwd(), 'docs', 'guide-sections', chapter.file);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.trim();
  } catch {
    console.error(`Failed to read chapter file: ${chapter.file}`);
    return '';
  }
}
