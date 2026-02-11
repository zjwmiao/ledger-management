# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + TypeScript management system (台账系统 - Ledger System) built with Vite, Element Plus, and Vue Router. The application is in early development with one main feature: Activity Management (活动管理).

**Tech Stack:**
- Vue 3.5.27 with Composition API (`<script setup>`)
- TypeScript 5.9.3
- Element Plus 2.13.2 (UI component library)
- Vue Router 5.0.1
- Pinia 3.0.4 (configured but unused)
- Vite 7.3.1 (build tool)
- pnpm (package manager)

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server with hot-reload
pnpm dev

# Type-check and build for production (runs in parallel)
pnpm build

# Build without type-checking
pnpm build-only

# Run TypeScript type checking
pnpm type-check

# Preview production build
pnpm preview
```

**Node Version Requirement:** `^20.19.0 || >=22.12.0`

## Architecture

### Component Hierarchy

```
App.vue
└── MainLayout.vue
    ├── Header.vue (台账系统 title)
    ├── Sidebar.vue (navigation menu with router integration)
    └── RouterView (page content)
        └── ActivityManagement.vue
            └── CommonTable.vue (feature-rich data table)
```

### Directory Structure

- **`src/components/`** - Reusable UI components (Header, Sidebar, MainLayout, CommonTable)
- **`src/views/`** - Page-level components (route targets)
- **`src/composables/`** - Vue 3 Composition API utilities (e.g., `useCheckbox.ts`)
- **`src/router/`** - Vue Router configuration
- **`src/stores/`** - Pinia stores (currently empty)
- **`src/shared/styles/`** - Global styles and Element Plus theme overrides

### Key Architectural Patterns

1. **Composition API with `<script setup>`**: All components use Vue 3's `<script setup>` syntax
2. **TypeScript Interfaces**: Props and emits are fully typed with interfaces
3. **Composables for Reusable Logic**: Extract shared logic into composables (e.g., `useCheckbox`)
4. **Slot-Based Customization**: Components expose slots for flexible content injection
5. **Event-Driven Communication**: Child components emit events to parent components

## CommonTable Component

The `CommonTable.vue` component is the most complex component in the codebase. It's a reusable data table wrapper around Element Plus's `el-table` with advanced features:

**Features:**
- **Filtering**: Checkbox-based filters with "select all" functionality
- **Searching**: Column-specific search with popover UI
- **Sorting**: Custom sorting via events
- **Expandable Rows**: Optional expandable content via slots
- **Cell Customization**: Slot-based cell rendering

**Props:**
- `columns: ColumnConfig[]` - Column definitions with feature flags
- `data: any[]` - Table data
- `expandable?: boolean` - Enable expandable rows

**Column Configuration:**
```typescript
interface ColumnConfig {
  prop: string              // Data property name
  label: string             // Column header text
  width?: string | number   // Fixed width
  minWidth?: string | number
  sortable?: boolean        // Enable sorting
  filterable?: boolean      // Enable filtering
  filterOptions?: FilterOption[]  // Filter options (required if filterable)
  searchable?: boolean      // Enable search
}
```

**Events:**
- `filter-change(prop: string, values: string[])` - Emitted when filter changes
- `search-change(prop: string, value: string)` - Emitted when search is performed
- `sort-change(prop: string, order: string | null)` - Emitted when sort changes

**Slots:**
- `[prop]` - Custom cell content (e.g., `#community`, `#activityName`)
- `expand` - Expandable row content (when `expandable` is true)

**Usage Example:**
```vue
<CommonTable
  :columns="tableColumns"
  :data="tableData"
  :expandable="true"
  @filter-change="handleFilter"
  @search-change="handleSearch"
  @sort-change="handleSort"
>
  <!-- Custom cell rendering -->
  <template #community="{ row }">
    <el-tag>{{ row.community }}</el-tag>
  </template>

  <!-- Expandable content -->
  <template #expand="{ row }">
    <div>Details: {{ row }}</div>
  </template>
</CommonTable>
```

**Internal State Management:**
- Uses `useCheckbox` composable for filter checkbox state
- Filter and search states stored in `shallowRef` to avoid deep reactivity overhead
- States are recreated when columns change to prevent stale data

## useCheckbox Composable

Located in `src/composables/useCheckbox.ts`, this composable manages checkbox group state with "select all" functionality.

**Signature:**
```typescript
useCheckbox(
  options: MaybeRef<{ value: string; label: string | number }[]>,
  checkedValues?: MaybeRef<string[]>
)
```

**Returns:**
```typescript
{
  checked: Ref<string[]>              // Currently checked values
  checkAll: WritableComputedRef<boolean>  // Select/deselect all
  isIndeterminate: ComputedRef<boolean>   // Indeterminate state
}
```

**Usage Pattern:**
```typescript
const { checked, checkAll, isIndeterminate } = useCheckbox(filterOptions)

// Bind to UI
<el-checkbox v-model="checkAll" :indeterminate="isIndeterminate">全选</el-checkbox>
<el-checkbox-group v-model="checked">
  <el-checkbox v-for="opt in options" :label="opt.value">{{ opt.label }}</el-checkbox>
</el-checkbox-group>
```

## Element Plus Integration

**Auto-Import Configuration:**
- Element Plus components are auto-imported via `unplugin-vue-components`
- Vue APIs are auto-imported via `unplugin-auto-import`
- Type declarations generated in `components.d.ts` and `auto-imports.d.ts`

**Theme Customization:**
- Primary color overridden to `rgb(0, 47, 167)` (dark blue)
- Theme file: `src/shared/styles/element-plus-theme.scss`
- Uses SCSS `@forward` directive to override Element Plus variables

**Import in main.ts:**
```typescript
import '@/shared/styles/element-plus-theme.scss'
import 'element-plus/dist/index.css'
```

## Routing

**Current Routes:**
- `/` → redirects to `/activity-management`
- `/activity-management` → `ActivityManagement.vue` (lazy-loaded)

**Sidebar Integration:**
- Sidebar uses `router` prop on `el-menu` for automatic navigation
- Active menu item synced with current route via `watch(() => route.path)`

**Adding New Routes:**
1. Create view component in `src/views/`
2. Add route to `src/router/index.ts`
3. Add menu item to `src/components/Sidebar.vue` with `index` matching route path

## State Management

**Current Approach:**
- Local component state using `ref()` and `reactive()`
- Composables for shared logic
- Pinia is installed but not yet used

**When to Use Pinia:**
- Cross-component state sharing
- Complex state logic
- State persistence needs

## Styling Conventions

**CSS Class Naming:** kebab-case (e.g., `.page-title`, `.action-buttons`)

**Scoped Styles:** All component styles are scoped

**Deep Selectors:** Use `:deep()` for styling child component internals
```vue
<style scoped>
.table-card :deep(.el-card__body) {
  padding: 20px;
}
</style>
```

**Global Styles:** Located in `src/shared/styles/base.css`

## TypeScript Patterns

**Component Props:**
```typescript
interface Props {
  columns: ColumnConfig[]
  data: any[]
  expandable?: boolean
}
const props = defineProps<Props>()
```

**Component Emits:**
```typescript
interface Emits {
  (e: 'filter-change', prop: string, values: string[]): void
  (e: 'search-change', prop: string, value: string): void
}
const emit = defineEmits<Emits>()
```

**Reactive State:**
- Use `ref()` for primitive values and objects that need full replacement
- Use `reactive()` for objects with stable references
- Use `shallowRef()` for large objects to avoid deep reactivity overhead

## Common Patterns

### Creating a New Page

1. Create view component in `src/views/YourPage.vue`
2. Add route in `src/router/index.ts`:
```typescript
{
  path: '/your-page',
  name: 'YourPage',
  component: () => import('@/views/YourPage.vue')
}
```
3. Add menu item in `src/components/Sidebar.vue`:
```vue
<el-menu-item index="/your-page">
  <span>Your Page</span>
</el-menu-item>
```

### Using CommonTable

See the `ActivityManagement.vue` component for a complete example of CommonTable usage with filtering, searching, and sorting.

### Creating a Composable

Follow the pattern in `src/composables/useCheckbox.ts`:
- Accept `MaybeRef` parameters for flexibility
- Return reactive refs and computed values
- Use TypeScript for type safety

## IDE Setup

**Recommended:** VS Code + Vue (Official) extension (Volar)

**Browser DevTools:**
- Install Vue.js devtools extension
- Enable Custom Object Formatter in DevTools settings

## Build Configuration

**Vite Config Highlights:**
- Path alias: `@` → `./src`
- Auto-import for Vue APIs and Element Plus
- SCSS preprocessing with Element Plus theme support
- Vue DevTools integration in development

**TypeScript Config:**
- Strict mode enabled
- Path alias configured for `@/*`
- Vue-specific type support via `vue-tsc`

## Language

The application UI is in Chinese (Simplified). When adding new features:
- Use Chinese for user-facing text
- Use English for code comments and technical documentation
- Follow existing naming patterns (e.g., 活动管理 = Activity Management)
