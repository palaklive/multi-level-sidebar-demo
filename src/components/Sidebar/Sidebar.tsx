import {
  BarChart3,
  FileText,
  Home,
  Mail,
  Settings,
  Users
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ExtendedSidebarItem,
  ItemsData,
  NavigationStackItem,
  SidebarItem
} from '../../types/sidebar';
import { Breadcrumb } from './components/Breadcrumb';
import { ContentPane } from './components/ContentPane';
import { SidebarContent } from './components/SidebarContent';
import './styles.css';
import { mockApiCall, mockContentLoad } from './utils/mockData';

const Sidebar: React.FC = () => {
  const [navigationStack, setNavigationStack] = useState<NavigationStackItem[]>([
    { id: 'root', label: 'Menu', items: [] }
  ]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [itemsData, setItemsData] = useState<Map<string, ItemsData>>(new Map());
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ExtendedSidebarItem | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const [isInfiniteScrolling, setIsInfiniteScrolling] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [showBreadcrumbDropdown, setShowBreadcrumbDropdown] = useState(false);
  const [pulsingItems, setPulsingItems] = useState<Set<string>>(new Set());
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);

  // Initialize root items
  useEffect(() => {
    const rootItems: SidebarItem[] = [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: Home, 
        hasChildren: true, 
        description: 'Main overview and analytics', 
        content: 'Central dashboard providing comprehensive overview of system performance, user activity, and key metrics with real-time updates.', 
        status: 'active', 
        lastModified: '2024-01-20' 
      },
      { 
        id: 'users', 
        label: 'User Management', 
        icon: Users, 
        hasChildren: true, 
        description: 'Manage users and permissions', 
        content: 'Complete user management system for handling user accounts, roles, permissions, and access control across the platform.', 
        status: 'active', 
        lastModified: '2024-01-19' 
      },
      { 
        id: 'content', 
        label: 'Content', 
        icon: FileText, 
        hasChildren: true, 
        description: 'Content management system', 
        content: 'Advanced content management system for creating, editing, organizing, and publishing digital content across multiple channels.', 
        status: 'active', 
        lastModified: '2024-01-18' 
      },
      { 
        id: 'system', 
        label: 'System Settings', 
        icon: Settings, 
        hasChildren: true, 
        description: 'System configuration', 
        content: 'Comprehensive system configuration panel for managing application settings, preferences, and operational parameters.', 
        status: 'active', 
        lastModified: '2024-01-17' 
      },
      { 
        id: 'reports', 
        label: 'Reports', 
        icon: BarChart3, 
        hasChildren: true, 
        description: 'Analytics and reporting', 
        content: 'Advanced reporting and analytics module with customizable dashboards, data visualization, and export capabilities.', 
        status: 'active', 
        lastModified: '2024-01-16' 
      },
      { 
        id: 'communication', 
        label: 'Communication', 
        icon: Mail, 
        hasChildren: true, 
        description: 'Messages and notifications', 
        content: 'Integrated communication platform for managing messages, notifications, announcements, and team collaboration tools.', 
        status: 'active', 
        lastModified: '2024-01-15' 
      }
    ];

    setItemsData(new Map([
      ['root', { items: rootItems, nextCursor: null, hasMore: false, loaded: true }]
    ]));
    
    setNavigationStack([{ id: 'root', label: 'Menu', items: rootItems }]);
  }, []);

  // Prefetch children on hover with debouncing
  const handleItemHover = useCallback(async (item: SidebarItem) => {
    if (!item.hasChildren) return;
    
    setHoveredItem(item.id);
    
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    const timeout = window.setTimeout(async () => {
      if (!itemsData.has(item.id) && !loadingItems.has(item.id)) {
        setLoadingItems(prev => new Set(prev).add(item.id));
        
        try {
          const result = await mockApiCall(item.id);
          setItemsData(prev => {
            const newData = new Map(prev);
            newData.set(item.id, { ...result, loaded: true });
            return newData;
          });
        } catch (error) {
          console.error('Failed to prefetch children:', error);
        } finally {
          setLoadingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(item.id);
            return newSet;
          });
        }
      }
    }, 300);
    
    setHoverTimeout(timeout);
  }, [itemsData, loadingItems, hoverTimeout]);

  const handleItemLeave = useCallback(() => {
    setHoveredItem(null);
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  }, [hoverTimeout]);

  // Handle item click with loading animation
  const handleItemClick = useCallback(async (item: SidebarItem) => {
    setActiveItem(item.id);
    setLoadingContent(true);
    
    // Start pulsing animation
    setPulsingItems(prev => new Set(prev).add(item.id));
    
    try {
      const contentData = await mockContentLoad(item.id);
      setSelectedItem({ ...item, contentData });
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoadingContent(false);
      // Remove pulsing animation after a delay
      setTimeout(() => {
        setPulsingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });
      }, 500);
    }
  }, []);

  // Navigate into submenu
  const navigateInto = useCallback(async (item: SidebarItem) => {
    if (!item.hasChildren) return;

    // Load children if not already loaded
    if (!itemsData.has(item.id)) {
      setLoadingItems(prev => new Set(prev).add(item.id));
      
      try {
        const result = await mockApiCall(item.id);
        setItemsData(prev => {
          const newData = new Map(prev);
          newData.set(item.id, { ...result, loaded: true });
          return newData;
        });
      } catch (error) {
        console.error('Failed to load children:', error);
        return;
      } finally {
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });
      }
    }

    const childData = itemsData.get(item.id);
    if (childData?.items) {
      setNavigationStack(prev => [...prev, { 
        id: item.id, 
        label: item.label, 
        items: childData.items 
      }]);
      setCurrentLevel(prev => prev + 1);
      setFocusedIndex(0);
      setSelectedItem(null);
      setActiveItem(null);
      
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [itemsData]);

  // Navigate back to parent level
  const navigateBack = useCallback(() => {
    if (currentLevel > 0) {
      setNavigationStack(prev => prev.slice(0, -1));
      setCurrentLevel(prev => prev - 1);
      setFocusedIndex(0);
      setActiveItem(null);
      setSelectedItem(null);
      
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [currentLevel]);

  // Navigate to specific level from breadcrumb
  const navigateToLevel = useCallback((targetLevel: number) => {
    if (targetLevel >= 0 && targetLevel < navigationStack.length) {
      setNavigationStack(prev => prev.slice(0, targetLevel + 1));
      setCurrentLevel(targetLevel);
      setFocusedIndex(0);
      setActiveItem(null);
      setSelectedItem(null);
      setShowBreadcrumbDropdown(false);
      
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [navigationStack]);

  // Infinite scroll implementation
  const loadMoreItems = useCallback(async (parentId: string) => {
    const currentData = itemsData.get(parentId);
    if (!currentData?.hasMore || isInfiniteScrolling) return;

    setIsInfiniteScrolling(true);

    try {
      const result = await mockApiCall(parentId, currentData.nextCursor);
      setItemsData(prev => {
        const newData = new Map(prev);
        const existing = newData.get(parentId);
        if (existing) {
          newData.set(parentId, {
            items: [...existing.items, ...result.items],
            nextCursor: result.nextCursor,
            hasMore: result.hasMore,
            loaded: true
          });
        }
        return newData;
      });
      
      setNavigationStack(prev => {
        const newStack = [...prev];
        const currentStackIndex = newStack.findIndex(stack => stack.id === parentId);
        if (currentStackIndex !== -1) {
          newStack[currentStackIndex] = {
            ...newStack[currentStackIndex],
            items: [...newStack[currentStackIndex].items, ...result.items]
          };
        }
        return newStack;
      });
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setIsInfiniteScrolling(false);
    }
  }, [itemsData, isInfiniteScrolling]);

  // Get current level items
  const getCurrentItems = useCallback((): SidebarItem[] => {
    const currentStack = navigationStack[currentLevel];
    if (!currentStack) return [];
    
    const parentData = itemsData.get(currentStack.id);
    return parentData?.items || currentStack.items || [];
  }, [navigationStack, currentLevel, itemsData]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const currentContainer = scrollContainerRef.current;
    if (!currentContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = currentContainer;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrollPercentage > 0.9) {
        const currentStack = navigationStack[currentLevel];
        const parentData = itemsData.get(currentStack?.id);
        
        if (parentData?.hasMore && !isInfiniteScrolling) {
          loadMoreItems(currentStack.id);
        }
      }
    };

    currentContainer.addEventListener('scroll', handleScroll);
    return () => currentContainer.removeEventListener('scroll', handleScroll);
  }, [loadMoreItems, navigationStack, currentLevel, itemsData, isInfiniteScrolling]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showBreadcrumbDropdown) {
        if (e.key === 'Escape') {
          setShowBreadcrumbDropdown(false);
        }
        return;
      }

      if (!sidebarRef.current?.contains(document.activeElement) && 
          document.activeElement?.tagName !== 'BODY') return;

      const currentItems = getCurrentItems();
      if (currentItems.length === 0) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(currentItems.length - 1, prev + 1));
          break;
        case 'ArrowRight': {
          e.preventDefault();
          const currentItem = currentItems[focusedIndex];
          if (currentItem?.hasChildren) {
            navigateInto(currentItem);
          }
          break;
        }
        case 'Enter': {
          e.preventDefault();
          const selectedCurrentItem = currentItems[focusedIndex];
          if (selectedCurrentItem) {
            handleItemClick(selectedCurrentItem);
          }
          break;
        }
        case 'ArrowLeft':
        case 'Backspace':
          e.preventDefault();
          navigateBack();
          break;
        case 'Escape':
          e.preventDefault();
          setNavigationStack(prev => prev.slice(0, 1));
          setCurrentLevel(0);
          setFocusedIndex(0);
          setSelectedItem(null);
          setActiveItem(null);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, getCurrentItems, handleItemClick, navigateInto, navigateBack, showBreadcrumbDropdown]);

  // Auto-scroll focused item into view
  useEffect(() => {
    const currentItems = getCurrentItems();
    const focusedItem = currentItems[focusedIndex];
    if (focusedItem) {
      const element = itemRefs.current.get(focusedItem.id);
      if (element && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.offsetHeight;

        if (elementTop < containerTop) {
          container.scrollTop = elementTop - 10;
        } else if (elementBottom > containerBottom) {
          container.scrollTop = elementBottom - container.offsetHeight + 10;
        }
      }
    }
  }, [focusedIndex, getCurrentItems, currentLevel]);

  // Click outside handler for breadcrumb dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (breadcrumbRef.current && !breadcrumbRef.current.contains(event.target as Node)) {
        setShowBreadcrumbDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentItems = getCurrentItems();
  const currentStack = navigationStack[currentLevel];
  const parentData = itemsData.get(currentStack?.id);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className="w-80 bg-white border-r border-gray-200 shadow-sm flex flex-col"
        tabIndex={0}
      >
        <Breadcrumb
          navigationStack={navigationStack}
          currentLevel={currentLevel}
          showBreadcrumbDropdown={showBreadcrumbDropdown}
          setShowBreadcrumbDropdown={setShowBreadcrumbDropdown}
          navigateBack={navigateBack}
          navigateToLevel={navigateToLevel}
          breadcrumbRef={breadcrumbRef}
        />

        <SidebarContent
          currentItems={currentItems}
          activeItem={activeItem}
          focusedIndex={focusedIndex}
          hoveredItem={hoveredItem}
          loadingItems={loadingItems}
          pulsingItems={pulsingItems}
          itemsData={itemsData}
          isInfiniteScrolling={isInfiniteScrolling}
          parentData={parentData}
          currentStack={currentStack}
          scrollContainerRef={scrollContainerRef}
          itemRefs={itemRefs}
          handleItemClick={handleItemClick}
          handleItemHover={handleItemHover}
          handleItemLeave={handleItemLeave}
          navigateInto={navigateInto}
        />

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span>Level {currentLevel + 1}</span>
              <span>•</span>
              <span>{currentItems.length} items</span>
              {parentData?.hasMore && (
                <>
                  <span>•</span>
                  <span className="text-blue-600">More available</span>
                </>
              )}
            </div>
            <span>Focus: {focusedIndex + 1}</span>
          </div>
        </div>
      </div>

      <ContentPane
        loadingContent={loadingContent}
        selectedItem={selectedItem}
        navigateInto={navigateInto}
        handleItemClick={handleItemClick}
        itemsData={itemsData}
      />
    </div>
  );
};

export default Sidebar;
