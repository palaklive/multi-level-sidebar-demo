import React from 'react';
import { Folder, Loader, ExternalLink } from 'lucide-react';
import type { SidebarItem, NavigationStackItem, ItemsData } from '../../../types/sidebar';

interface SidebarContentProps {
  currentItems: SidebarItem[];
  activeItem: string | null;
  focusedIndex: number;
  hoveredItem: string | null;
  loadingItems: Set<string>;
  pulsingItems: Set<string>;
  itemsData: Map<string, ItemsData>;
  isInfiniteScrolling: boolean;
  parentData: ItemsData | undefined;
  currentStack: NavigationStackItem | undefined;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  handleItemClick: (item: SidebarItem) => void;
  handleItemHover: (item: SidebarItem) => void;
  handleItemLeave: () => void;
  navigateInto: (item: SidebarItem) => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  currentItems,
  activeItem,
  focusedIndex,
  hoveredItem,
  loadingItems,
  pulsingItems,
  itemsData,
  isInfiniteScrolling,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parentData: _parentData, // Unused but kept for interface compatibility
  currentStack,
  scrollContainerRef,
  itemRefs,
  handleItemClick,
  handleItemHover,
  handleItemLeave,
  navigateInto
}) => {
  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
    >
      <div className="p-3 space-y-1">
        {currentItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          const isFocused = index === focusedIndex;
          const isHovered = hoveredItem === item.id;
          const isLoading = loadingItems.has(item.id);
          const isPulsing = pulsingItems.has(item.id);

          return (
            <div
              key={item.id}
              ref={el => {
                if (el) itemRefs.current.set(item.id, el);
              }}
              className={`group relative rounded-lg transition-all duration-150 cursor-pointer ${
                isPulsing ? 'animate-pulse' : ''
              } ${
                isActive
                  ? 'bg-blue-50 border border-blue-200 shadow-sm'
                  : isFocused
                  ? 'bg-gray-100 border border-gray-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => handleItemHover(item)}
              onMouseLeave={handleItemLeave}
              onDoubleClick={() => item.hasChildren && navigateInto(item)}
            >
              <div className="flex items-start p-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon 
                    size={18} 
                    className={`${
                      isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                    } transition-colors`} 
                  />
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-medium truncate ${
                      isActive ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </h3>
                    
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      {isLoading && <Loader size={12} className="text-gray-400 animate-spin" />}
                      {item.hasChildren && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded">
                            {isHovered && itemsData.has(item.id) 
                              ? itemsData.get(item.id)?.items.length 
                              : '...'
                            }
                          </span>
                          <Folder size={12} className="text-gray-400" />
                        </div>
                      )}
                      <ExternalLink size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  {item.status && (
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                        item.status === 'active' ? 'bg-green-100 text-green-700' :
                        item.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.lastModified}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Hover indicator */}
              {isHovered && item.hasChildren && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"></div>
              )}
              
              {/* Focus indicator */}
              {isFocused && (
                <div className="absolute right-2 top-2 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })}

        {/* Infinite scroll loading indicator */}
        {isInfiniteScrolling && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">Loading more items...</span>
            </div>
          </div>
        )}

        {currentItems.length === 0 && !loadingItems.has(currentStack?.id || '') && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Folder size={32} className="mb-3 text-gray-300" />
            <p className="text-sm">No items found</p>
          </div>
        )}
      </div>
    </div>
  );
};
