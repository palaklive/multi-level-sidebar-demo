# Multi-Level Sidebar Component

## Overview
A sophisticated multi-level sidebar navigation component built with React, TypeScript, and Tailwind CSS. This component features:

- 🎯 **Multi-level Navigation**: Navigate through infinite nested levels with breadcrumb support
- ⚡ **Lazy Loading**: Children are loaded on-demand with prefetching on hover
- ♾️ **Infinite Scrolling**: Load more items as you scroll
- ⌨️ **Keyboard Navigation**: Full keyboard support with shortcuts
- 🎨 **Beautiful UI**: Modern design with smooth animations and transitions
- 📱 **Responsive**: Optimized for different screen sizes
- 🔍 **Smart Breadcrumbs**: Intelligent breadcrumb that collapses when too many levels
- 💾 **State Management**: Comprehensive state management with loading states

## Installation

### Fix NPM Issues (if needed)
If you encounter npm installation issues:
```bash
# Clear npm cache
npm cache clean --force

# Or try using yarn
yarn install

# Or manually install dependencies
npm install --legacy-peer-deps
```

### Install Dependencies
```bash
npm install lucide-react
# or
yarn add lucide-react
```

### Run the Application
```bash
npm run dev
# or
yarn dev
```

## Features

### Navigation Features
- **Breadcrumb Navigation**: Smart breadcrumb that shows current path with collapsible hidden levels
- **Keyboard Shortcuts**:
  - `↑/↓` - Navigate items
  - `→` - Expand item (if has children)
  - `Enter` - View item details
  - `←/Backspace` - Go back to parent
  - `Esc` - Return to root

### Performance Features
- **Lazy Loading**: Items are loaded only when needed
- **Hover Prefetching**: Children are prefetched on hover for instant navigation
- **Infinite Scroll**: Automatically load more items as you scroll
- **Optimized Rendering**: Only visible items are rendered

### UI Features
- **Loading States**: Visual feedback for all loading operations
- **Status Indicators**: Active, draft, and archived status badges
- **Item Metadata**: Last modified dates and item counts
- **Content Preview**: Rich content preview pane with statistics
- **Smooth Animations**: Pulse effects and smooth transitions

## Component Structure

```
src/
├── components/
│   └── Sidebar/
│       ├── Sidebar.tsx          # Main sidebar component
│       ├── components/
│       │   ├── Breadcrumb.tsx   # Breadcrumb navigation
│       │   ├── SidebarContent.tsx # Sidebar items list
│       │   └── ContentPane.tsx  # Content preview pane
│       ├── utils/
│       │   └── mockData.ts      # Mock data generation
│       └── styles.css           # Custom styles
├── types/
│   └── sidebar.ts               # TypeScript definitions
└── App.tsx                      # Main app component
```

## Usage

The sidebar is integrated into the main App component:

```tsx
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <div className="h-screen w-full">
      <Sidebar />
    </div>
  );
}
```

## Customization

### Adding Real Data
Replace the mock API calls in `utils/mockData.ts` with your actual API endpoints:

```typescript
export const mockApiCall = async (parentId: string, cursor: string | null = null) => {
  // Replace with your API call
  const response = await fetch(`/api/items/${parentId}?cursor=${cursor}`);
  return response.json();
};
```

### Styling
The component uses Tailwind CSS for styling. You can customize colors and styles by:
1. Modifying Tailwind classes in the components
2. Updating the custom CSS in `styles.css`
3. Adjusting the Tailwind configuration

## Architecture

### State Management
The component uses React hooks for state management:
- `navigationStack`: Tracks navigation history
- `itemsData`: Caches loaded items
- `loadingItems`: Tracks loading states
- `selectedItem`: Currently selected item

### Performance Optimizations
- **Memoization**: Uses `useCallback` to prevent unnecessary re-renders
- **Refs**: Uses refs for DOM manipulation without re-renders
- **Lazy Loading**: Loads data only when needed
- **Debouncing**: Hover prefetching is debounced to prevent excessive API calls

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License
MIT
