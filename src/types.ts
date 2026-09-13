export interface Drama {
  id: string;
  title: string;
  episodeCount: number;
  year: number;
  genres: string[];
  posterUrl: string;
  bannerUrl: string;
  synopsis: string;
  rating: number;
  views?: number;
  viewCountFormatted?: string;
  isNewRelease?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  type: 'Drama Serial' | 'Film Layar Lebar' | 'Mini Series';
  duration?: string;
  director?: string;
  cast: string[];
  videoUrl: string;
  embedUrl?: string;
  embedCode?: string;
}

export type NavTab = 'home' | 'featured' | 'drama' | 'genre' | 'hot' | 'terbaru' | 'mylist';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}
