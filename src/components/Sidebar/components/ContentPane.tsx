import React from 'react';
import { FileText, Folder, ChevronRight } from 'lucide-react';
import type { ExtendedSidebarItem, SidebarItem, ItemsData } from '../../../types/sidebar';

interface ContentPaneProps {
  loadingContent: boolean;
  selectedItem: ExtendedSidebarItem | null;
  navigateInto: (item: SidebarItem) => void;
  handleItemClick: (item: SidebarItem) => void;
  itemsData: Map<string, ItemsData>;
}

export const ContentPane: React.FC<ContentPaneProps> = ({
  loadingContent,
  selectedItem,
  navigateInto,
  handleItemClick,
  itemsData
}) => {
  if (loadingContent) {
    return (
      <div className="flex-1 bg-gray-50">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="flex-1 bg-gray-50">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold mb-2">Select an item to view details</h2>
            <p className="text-gray-400">Click on any item in the sidebar to see its content</p>
            <div className="mt-6 text-sm">
              <p className="mb-2">Keyboard shortcuts:</p>
              <div className="flex flex-col gap-1 text-xs text-gray-400">
                <div>↑↓ Navigate items</div>
                <div>Enter - View item details</div>
                <div>→ - Expand item (if has children)</div>
                <div>← - Go back to parent</div>
                <div>Esc - Return to root</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const SelectedIcon = selectedItem.icon;

  return (
    <div className="flex-1 bg-gray-50">
      <div className="h-full overflow-y-auto">
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <SelectedIcon size={32} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedItem.label}
                </h1>
                <div className="flex items-center gap-2">
                  {selectedItem.status && (
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      selectedItem.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedItem.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedItem.status}
                    </span>
                  )}
                  {selectedItem.hasChildren && (
                    <button
                      onClick={() => navigateInto(selectedItem)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <Folder size={12} />
                      <span>Explore</span>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {selectedItem.description}
              </p>
              
              {/* Meta information */}
              <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
                {selectedItem.lastModified && (
                  <div>
                    <span className="font-medium">Last Modified:</span> {selectedItem.lastModified}
                  </div>
                )}
                <div>
                  <span className="font-medium">Type:</span> {selectedItem.hasChildren ? 'Container' : 'Item'}
                </div>
                {selectedItem.contentData && (
                  <>
                    <div>
                      <span className="font-medium">Views:</span> {selectedItem.contentData.metrics.views}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span> {selectedItem.contentData.metrics.size}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="max-w-4xl">
            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {selectedItem.content}
                </p>
                
                {selectedItem.contentData && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-2">Detailed Information</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedItem.contentData.fullContent}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-2">Usage Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedItem.contentData.metrics.views}
                          </div>
                          <div className="text-sm text-gray-600">Total Views</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedItem.contentData.metrics.size}
                          </div>
                          <div className="text-sm text-gray-600">Content Size</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {new Date(selectedItem.contentData.metrics.lastAccessed).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">Last Accessed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {selectedItem.contentData?.actions && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Actions</h2>
                <div className="flex flex-wrap gap-3">
                  {selectedItem.contentData.actions.map((action, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <span>{action}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Children Preview */}
            {selectedItem.hasChildren && itemsData.has(selectedItem.id) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Contents Preview</h2>
                  <button
                    onClick={() => navigateInto(selectedItem)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {itemsData.get(selectedItem.id)?.items.slice(0, 6).map((childItem) => {
                    const ChildIcon = childItem.icon;
                    return (
                      <div
                        key={childItem.id}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleItemClick(childItem)}
                      >
                        <div className="flex items-start gap-3">
                          <ChildIcon size={16} className="text-gray-500 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {childItem.label}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {childItem.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {itemsData.get(selectedItem.id)!.items.length > 6 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => navigateInto(selectedItem)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View {itemsData.get(selectedItem.id)!.items.length - 6} more items
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
