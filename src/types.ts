export type SceneId = 
  | 'opening'
  | 'birthday'
  | 'memories'
  | 'timeline'
  | 'letter'
  | 'promise'
  | 'celebration';

export interface PhotoMemory {
  id: string;
  url: string;
  caption: string;
  friendshipNote?: string;
  isFeatured?: boolean;
  dateAdded?: string;
}

export interface TimelineChapter {
  id: number;
  chapterNumber: string;
  title: string;
  message: string;
  reflection: string;
}

export interface ExperienceConfig {
  recipientName: string;
  milestone: string;
  birthdayDate: string;
  signature: string;
  customWishText: string;
  photos: PhotoMemory[];
}
