import type { LucideIcon } from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  hasChildren: boolean;
  description?: string;
  content?: string;
  lastModified?: string;
  status?: 'active' | 'draft' | 'archived';
}

export interface NavigationStackItem {
  id: string;
  label: string;
  items: SidebarItem[];
}

export interface ItemsData {
  items: SidebarItem[];
  nextCursor: string | null;
  hasMore: boolean;
  loaded: boolean;
}

export interface ContentData {
  id: string;
  fullContent: string;
  metrics: {
    views: number;
    lastAccessed: string;
    size: string;
  };
  actions: string[];
}

export interface ExtendedSidebarItem extends SidebarItem {
  contentData?: ContentData;
}
