import { ExperienceConfig, PhotoMemory, TimelineChapter } from '../types';

const STORAGE_KEY = 'bushra_birthday_experience_config_v4';

// Default initial config with 2 special photos of Bushra
export const DEFAULT_CONFIG: ExperienceConfig = {
  recipientName: 'Bushra',
  milestone: '15th',
  birthdayDate: '27 October 2026',
  signature: 'Your Best Friend, Rupto',
  customWishText: 'May this year bring you more happiness, beautiful memories, and reasons to believe in yourself.',
  photos: [
    {
      id: 'memory-bushra-1',
      url: '/assets/aistudio/WhatsApp_Image_2026-10-26_at_5.57.00_PM_31b69e3e.jpeg',
      caption: 'A Radiant Smile',
      friendshipNote: 'That bright red dress and genuine happy smile — a wonderful reminder of the kind, joyful soul you have always been. So grateful to have you as my best friend.',
      isFeatured: true,
      dateAdded: '2026-10-27',
    },
    {
      id: 'memory-bushra-2',
      url: '/assets/aistudio/WhatsApp_Image_2026-10-26_at_5.57.04_PM_3dc12f95.jpeg',
      caption: 'Quiet Moments & Gentle Grace',
      friendshipNote: 'Under the shade of the green trees in a sky-blue dress — proof that the purest, most honest moments stay in our hearts the longest.',
      isFeatured: false,
      dateAdded: '2026-10-27',
    },
  ],
};

export const TIMELINE_CHAPTERS: TimelineChapter[] = [
  {
    id: 1,
    chapterNumber: '01',
    title: 'The Beginning',
    message: 'Every friendship has a beginning. Some become more meaningful with time.',
    reflection: 'Out of all the coincidences in life, getting to know you was one of the very best.',
  },
  {
    id: 2,
    chapterNumber: '02',
    title: 'The Little Things',
    message: 'Random conversations, unexpected laughter, and the little moments that make ordinary days memorable.',
    reflection: 'It was never about grand occasions — just the quiet comfort of being ourselves.',
  },
  {
    id: 3,
    chapterNumber: '03',
    title: 'Through Every Chapter',
    message: 'Life keeps changing, and we keep growing. I hope we continue supporting each other along the way.',
    reflection: 'Through busy schedules, new challenges, and everyday changes, we cheer each other on.',
  },
  {
    id: 4,
    chapterNumber: '04',
    title: 'The Years Ahead',
    message: "I hope that years from now, we'll still be able to laugh together and create new memories.",
    reflection: 'Because true friendship isn’t about never changing; it is about growing together.',
  },
];

export function loadConfig(): ExperienceConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        photos: parsed.photos && parsed.photos.length > 0 ? parsed.photos : DEFAULT_CONFIG.photos,
      };
    }
  } catch (e) {
    console.warn('Could not read from localStorage', e);
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(config: ExperienceConfig): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error('Could not save to localStorage', e);
    return false;
  }
}

export function resetConfig(): ExperienceConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not reset localStorage', e);
  }
  return DEFAULT_CONFIG;
}
