# Multi-Level Sidebar Navigation Demo

A **React + TypeScript** demo that showcases an advanced, infinitely nestable sidebar with modern UX patterns such as lazy data loading, breadcrumb navigation, hover-prefetch, keyboard shortcuts, and an optional content preview pane.  
Built with **Vite**, **Tailwind CSS**, and **Lucide Icons**.

---

## ✨ Features

| Category        | Highlights                                                                                           |
|-----------------|-------------------------------------------------------------------------------------------------------|
| Navigation      | • Unlimited nested levels<br>• Smart breadcrumb that collapses long paths<br>• Keyboard shortcuts    |
| Performance     | • Children loaded on-demand<br>• Hover prefetching<br>• Infinite scroll per level                     |
| UI/UX           | • Animated loading pulses & transitions<br>• Live status badges<br>• Rich content preview pane        |
| Accessibility   | • Full keyboard support (arrow keys, _Enter_, _Esc_, _Backspace_)<br>• Screen-reader friendly labels |

### Detailed Features

- 🎯 **Multi-level Navigation**: Navigate through infinite nested levels with breadcrumb support
- ⚡ **Lazy Loading**: Children are loaded on-demand with prefetching on hover
- ♾️ **Infinite Scrolling**: Load more items as you scroll
- ⌨️ **Keyboard Navigation**: Full keyboard support with shortcuts
- 🎨 **Beautiful UI**: Modern design with smooth animations and transitions
- 📱 **Responsive**: Optimized for different screen sizes
- 🔍 **Smart Breadcrumbs**: Intelligent breadcrumb that collapses when too many levels
- 💾 **State Management**: Comprehensive state management with loading states

---

## 📦 Tech Stack

* React 18 + TypeScript  
* Vite (dev/build tooling)  
* Tailwind CSS  
* Lucide-React icon set  

---

## 🚀 Getting Started

```bash
# 1) Install dependencies
pnpm install   # or: npm install / yarn install

# 2) Run the dev server
pnpm dev       # or: npm run dev / yarn dev
```

The app will be available at `http://localhost:5173`.

---

## 🗂️ Project Structure

```
src/
├── components/
│   └── Sidebar/
│       ├── Sidebar.tsx            # Root component (state & navigation logic)
│       ├── components/
│       │   ├── Breadcrumb.tsx     # Collapsible breadcrumb bar
│       │   ├── SidebarContent.tsx # Scrollable list with infinite-scroll + hover-prefetch
│       │   └── ContentPane.tsx    # Optional details/preview pane
│       ├── utils/
│       │   └── mockData.ts        # Mock API helpers
│       └── styles.css             # Custom animations & overrides
├── types/
│   └── sidebar.ts                 # Shared type definitions
└── App.tsx                        # Integrates the sidebar into the page
```

---

## ⌨️ Keyboard Shortcuts

| Key / Combo     | Action                           |
|-----------------|----------------------------------|
| ↑ / ↓           | Move focus up / down             |
| →               | Expand item (if it has children) |
| ← or Backspace  | Go back to parent level          |
| Enter           | Select item / show content pane  |
| Esc             | Jump back to the root level      |

---

## 🔧 Customization

### 1. Replace Mock API
Swap out the functions in `src/components/Sidebar/utils/mockData.ts` with real API calls that return the same shape:
```ts
export const mockApiCall = async (parentId: string, cursor?: string | null) => {
  // Call your backend instead
  const res = await fetch(`/api/items/${parentId}?cursor=${cursor ?? ""}`);
  return res.json();
};
```

### 2. Styling
The component uses Tailwind CSS for styling. You can customize by:
1. Modifying Tailwind classes in the components
2. Updating the custom CSS in `styles.css`
3. Adjusting the Tailwind configuration

---

## 🏗️ Architecture

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

---

## 🌐 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📜 License
MIT © 2024