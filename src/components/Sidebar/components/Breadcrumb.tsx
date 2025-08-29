import React from 'react';
import { ChevronRight, ArrowLeft, MoreHorizontal } from 'lucide-react';
import type { NavigationStackItem } from '../../../types/sidebar';

interface BreadcrumbProps {
  navigationStack: NavigationStackItem[];
  currentLevel: number;
  showBreadcrumbDropdown: boolean;
  setShowBreadcrumbDropdown: (show: boolean) => void;
  navigateBack: () => void;
  navigateToLevel: (level: number) => void;
  breadcrumbRef: React.RefObject<HTMLDivElement | null>;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  navigationStack,
  currentLevel,
  showBreadcrumbDropdown,
  setShowBreadcrumbDropdown,
  navigateBack,
  navigateToLevel,
  breadcrumbRef
}) => {
  // Smart breadcrumb logic
  const getSmartBreadcrumb = () => {
    const maxVisible = 3;
    const stack = navigationStack.slice(0, currentLevel + 1);
    
    if (stack.length <= maxVisible) {
      return { visible: stack, hidden: [] };
    }
    
    return {
      visible: [stack[0], ...stack.slice(-2)],
      hidden: stack.slice(1, -2)
    };
  };

  const { visible: visibleBreadcrumb, hidden: hiddenBreadcrumb } = getSmartBreadcrumb();

  return (
    <div className="p-4 border-b border-gray-100 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
        {currentLevel > 0 && (
          <button
            onClick={navigateBack}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
            title="Go back (←)"
          >
            <ArrowLeft size={16} />
          </button>
        )}
      </div>
      
      {/* Smart Breadcrumb */}
      <div ref={breadcrumbRef} className="flex items-center gap-1 text-sm text-gray-600 relative flex-wrap">
        {visibleBreadcrumb.map((item, index) => (
          <React.Fragment key={`${item.id}-${index}`}>
            {index > 0 && <ChevronRight size={12} className="text-gray-400" />}
            
            {/* Show ellipsis for hidden items */}
            {index === 1 && hiddenBreadcrumb.length > 0 && (
              <>
                <button
                  onClick={() => setShowBreadcrumbDropdown(!showBreadcrumbDropdown)}
                  className="px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                  title={`${hiddenBreadcrumb.length} hidden levels`}
                >
                  <MoreHorizontal size={14} />
                </button>
                <ChevronRight size={12} className="text-gray-400" />
                
                {/* Dropdown for hidden breadcrumb items */}
                {showBreadcrumbDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[12rem]">
                    <div className="py-1">
                      {hiddenBreadcrumb.map((hiddenItem, hiddenIndex) => {
                        const levelIndex = hiddenIndex + 1;
                        return (
                          <button
                            key={hiddenItem.id}
                            onClick={() => navigateToLevel(levelIndex)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <span className="text-gray-400">L{levelIndex + 1}</span>
                            <span className="truncate">{hiddenItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
            
            <button
              onClick={() => navigateToLevel(index === 0 ? 0 : currentLevel - (visibleBreadcrumb.length - 1 - index))}
              className={`px-2 py-1 rounded transition-colors truncate max-w-[8rem] ${
                index === visibleBreadcrumb.length - 1
                  ? 'text-gray-800 font-medium bg-gray-100'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Keyboard hints */}
      <div className="text-xs text-gray-400 mt-2">
        ↑↓ Navigate • → Expand • Enter Select • ← Back • Esc Home
      </div>
    </div>
  );
};
