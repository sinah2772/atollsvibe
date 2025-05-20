export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  articles: number;
  joined: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate?: string;
  category: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  coverImage?: string;
  isBreaking?: boolean;
  isDeveloping?: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
  isSponsored?: boolean;
  sponsoredBy?: string;
  sponsoredUrl?: string;
}

export interface Notification {
  id: string;
  type: 'comment' | 'like' | 'system' | 'mention';
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

export interface Metric {
  name: string;
  value: number;
  change: number;
  timeframe: string;
}

export interface ChartData {
  name: string;
  views: number;
  likes: number;
  comments: number;
}

export interface Category {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  created_at: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  category_id: number;
  created_at: string;
}

export interface Atoll {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  created_at: string;
  island_reference?: string;
  island_reference_dv?: string;
}

export interface Island {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  island_code?: string;
  island_category?: string;
  island_category_en?: string;
  island_details?: string;
  longitude?: string;
  latitude?: string;
  election_commission_code?: string;
  postal_code?: string;
  other_name_en?: string;
  other_name_dv?: string;
  list_order?: number;
  atoll_id?: number;
  created_at: string;
  atoll?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
}

export interface Ad {
  id: string;
  title: string;
  description?: string;
  target_audience?: string;
  budget?: number;
  status: 'active' | 'paused' | 'deleted';
  media_url: string;
  created_at: string;
  updated_at: string;
}