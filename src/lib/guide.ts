import chaptersData from '@/data/chapters.json';

export type AccessLevel = 'free' | 'teaser' | 'gated' | 'lead-magnet' | 'premium';

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  file: string;
  order: number;
  accessLevel: AccessLevel;
  teaserPercentage?: number;
  description: string;
  wordCount: number;
}

export interface GuideMeta {
  totalChapters: number;
  totalWords: number;
  freeChapters: number;
  teaserChapters: number;
  gatedChapters: number;
  leadMagnetChapter: string;
  premiumChapters: number;
}

export const chapters: Chapter[] = chaptersData.chapters as Chapter[];
export const guideMeta: GuideMeta = chaptersData.meta as GuideMeta;

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find(c => c.slug === slug);
}

export function getAllChapterSlugs(): string[] {
  return chapters.map(c => c.slug);
}

export function getFreeChapters(): Chapter[] {
  return chapters.filter(c => c.accessLevel === 'free');
}

export function getTeaserChapters(): Chapter[] {
  return chapters.filter(c => c.accessLevel === 'teaser');
}

export function getLeadMagnetChapter(): Chapter | undefined {
  return chapters.find(c => c.accessLevel === 'lead-magnet');
}

export function getGatedChapters(): Chapter[] {
  return chapters.filter(c => c.accessLevel === 'gated');
}

export function getPremiumChapters(): Chapter[] {
  return chapters.filter(c => c.accessLevel === 'premium');
}

export function getTeaserContent(content: string, percentage: number = 30): string {
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  const teaserCount = Math.ceil(paragraphs.length * (percentage / 100));
  return paragraphs.slice(0, teaserCount).join('\n\n');
}

export function formatContentToHtml(content: string): string {
  // Convert plain text to basic HTML paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return paragraphs.map(p => {
    const trimmed = p.trim();

    // Check if it's a spaced-out heading like "Y O U R  O P P O R T U N I T Y"
    // These have single letters separated by spaces
    if (/^([A-Z]\s)+[A-Z]?$/i.test(trimmed.replace(/\s{2,}/g, ' '))) {
      // Remove all spaces to get the actual word(s)
      const heading = trimmed.replace(/\s+/g, '');
      // Add spaces back between words (look for capital letters that start new words)
      const formatted = heading.replace(/([a-z])([A-Z])/g, '$1 $2');
      return `<h2 class="text-3xl font-bold mt-10 mb-6 text-primary">${formatted}</h2>`;
    }

    // Check if it's all caps heading (like "WHY BALI" or "CHALLENGES")
    if (/^[A-Z\s&]+$/.test(trimmed) && trimmed.length < 60 && trimmed.length > 2) {
      return `<h2 class="text-2xl font-bold mt-10 mb-4">${trimmed}</h2>`;
    }

    // Check if it's a subheading with colon (like "Rain:" or "Storage:")
    if (trimmed.includes(':') && trimmed.indexOf(':') < 40) {
      const colonIndex = trimmed.indexOf(':');
      const heading = trimmed.slice(0, colonIndex);
      const rest = trimmed.slice(colonIndex + 1).trim();

      if (heading.length < 40 && /^[A-Z]/.test(heading)) {
        return `<h3 class="text-lg font-semibold mt-6 mb-2">${heading}</h3>\n<p class="mb-4 leading-relaxed text-muted-foreground">${rest}</p>`;
      }
    }

    // Check if it's a short subheading (starts with caps, no period, under 80 chars)
    if (trimmed.length < 80 && /^[A-Z]/.test(trimmed) && !trimmed.includes('.') && trimmed.split(' ').length < 8) {
      return `<h3 class="text-xl font-semibold mt-8 mb-3">${trimmed}</h3>`;
    }

    // Regular paragraph
    return `<p class="mb-4 leading-relaxed text-foreground/90">${trimmed}</p>`;
  }).join('\n');
}

// Check if user has access to a chapter based on membership
export function getUserAccessLevel(
  chapter: Chapter,
  userMembership?: { tier: string; hasLeadMagnetAccess?: boolean }
): 'full' | 'teaser' | 'lead-magnet' | 'none' {
  // Free chapters are accessible to everyone
  if (chapter.accessLevel === 'free') {
    return 'full';
  }

  // Check membership tier
  const tier = userMembership?.tier || 'free';

  // Premium members get everything
  if (tier === 'investor') {
    return 'full';
  }

  // Guide-only members get everything except premium
  if (tier === 'guide') {
    if (chapter.accessLevel === 'premium') {
      return 'none';
    }
    return 'full';
  }

  // Free users
  if (chapter.accessLevel === 'lead-magnet') {
    // Check if they've submitted email
    if (userMembership?.hasLeadMagnetAccess) {
      return 'full';
    }
    return 'lead-magnet';
  }

  if (chapter.accessLevel === 'teaser') {
    return 'teaser';
  }

  return 'none';
}
