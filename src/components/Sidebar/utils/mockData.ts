import { Home, FileText, Folder, Database, Settings, Shield, Globe, Monitor, HardDrive } from 'lucide-react';
import type { SidebarItem, ItemsData, ContentData } from '../../../types/sidebar';

// Get icon for a specific depth level
export const getIconForDepth = (depth: number) => {
  const icons = [Home, FileText, Folder, Database, Settings, Shield, Globe, Monitor, HardDrive];
  return icons[Math.min(depth, icons.length - 1)];
};

// Get item type label based on depth
export const getItemTypeLabel = (depth: number): string => {
  const types = ['Dashboard', 'Section', 'Category', 'Subcategory', 'Item', 'Subitem', 'Element', 'Component', 'Detail'];
  return types[Math.min(depth, types.length - 1)];
};

// Get description for a specific depth
export const getDescriptionForDepth = (depth: number): string => {
  const descriptions = [
    'Main navigation area',
    'Primary content section',
    'Organized content group',
    'Detailed subcategory',
    'Individual content item',
    'Specific configuration',
    'System component',
    'Technical detail',
    'Configuration option'
  ];
  return descriptions[Math.min(depth, descriptions.length - 1)];
};

// Generate mock content based on item depth
export const generateMockContent = (_id: string, depth: number): string => {
  const contentTypes = [
    'Comprehensive dashboard with real-time analytics and key performance indicators.',
    'User management interface with role-based access control and permission settings.',
    'Content management system for creating, editing, and organizing digital assets.',
    'System configuration panel for managing application settings and preferences.',
    'Detailed reporting module with customizable charts and data visualization.',
    'Communication hub for managing messages, notifications, and team collaboration.',
    'Advanced settings panel for fine-tuning system behavior and optimization.',
    'Data management interface for handling large datasets and database operations.',
    'Security configuration center for managing authentication and authorization.'
  ];
  return contentTypes[Math.min(depth, contentTypes.length - 1)];
};

// Mock API call simulation for lazy loading
export const mockApiCall = async (
  parentId: string, 
  cursor: string | null = null, 
  limit: number = 20
): Promise<ItemsData> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const generateItems = (parentId: string, startIndex: number, count: number): SidebarItem[] => {
    const items: SidebarItem[] = [];
    const depth = (parentId.match(/-/g) || []).length;
    
    for (let i = 0; i < count; i++) {
      const index = startIndex + i;
      const id = `${parentId}-${index}`;
      const hasChildren = depth < 8 && Math.random() > 0.3;
      
      items.push({
        id,
        label: `${getItemTypeLabel(depth)} ${index + 1}`,
        icon: getIconForDepth(depth),
        hasChildren,
        description: getDescriptionForDepth(depth),
        content: generateMockContent(id, depth),
        lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        status: (['active', 'draft', 'archived'] as const)[Math.floor(Math.random() * 3)]
      });
    }
    return items;
  };

  const cursorIndex = cursor ? parseInt(cursor.split('-').pop() || '0') + 1 : 0;
  const items = generateItems(parentId, cursorIndex, limit);
  const maxItems = 150;
  const hasMore = cursorIndex + items.length < maxItems;
  const nextCursor = hasMore ? items[items.length - 1]?.id || null : null;

  return { items, nextCursor, hasMore, loaded: true };
};

// Mock content loading API
export const mockContentLoad = async (itemId: string): Promise<ContentData> => {
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  return {
    id: itemId,
    fullContent: `This is the detailed content for ${itemId}. It contains comprehensive information about this item including its functionality, configuration options, and usage examples. This content is dynamically loaded when the item is selected.`,
    metrics: {
      views: Math.floor(Math.random() * 1000),
      lastAccessed: new Date().toISOString(),
      size: `${Math.floor(Math.random() * 500 + 50)}KB`
    },
    actions: ['Edit', 'Duplicate', 'Share', 'Delete']
  };
};
