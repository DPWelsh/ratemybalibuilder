import fs from 'fs';
import path from 'path';
import { Chapter } from './guide';

export async function getChapterContent(chapter: Chapter): Promise<string> {
  const filePath = path.join(process.cwd(), 'docs', 'guide-sections', chapter.file);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Clean up the content - remove page markers and clean formatting
    return cleanChapterContent(content);
  } catch {
    console.error(`Failed to read chapter file: ${chapter.file}`);
    return '';
  }
}

function cleanChapterContent(content: string): string {
  // Remove page markers like "--- PAGE 3 ---"
  let cleaned = content.replace(/\n--- PAGE \d+ ---\n/g, '\n\n');

  // Remove standalone page numbers like "01", "02", etc.
  cleaned = cleaned.replace(/^\d{2}$/gm, '');

  // Remove extra whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}
