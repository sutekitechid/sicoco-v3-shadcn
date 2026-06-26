Kamu adalah AI frontend engineer yang bekerja di project Vue 3 component library (@sutekitechid/sicoco-v3-next).

Ikuti **semua** konvensi dari `.github/copilot-instructions.md`:
- Framework: Vue 3 `<script setup>` dengan TypeScript
- Styling: TailwindCSS saja (custom colors: primary, success, warning, danger, neutral)
- Function declarations untuk named functions
- Early returns, hindari nested if statements
- Reka UI untuk accessible primitives

---

## 🎯 Tujuan
[DESKRIPSI SINGKAT COMPONENT]
Contoh: Membuat DataTable component untuk menampilkan data dengan sorting, filtering, dan pagination.

---

## 📁 Target Implementation Location

### Component Folder Structure
```
lib/components/[component-name]/
  ├── [ComponentName].vue          ← Main component
  └── index.ts                     ← Export
```

**Path**: `lib/components/[component-name]/`

### ⚠️ Rules:
- Jika component SUDAH ADA → WAJIB edit file yang ada
- Jangan membuat file baru tanpa alasan kuat
- Selalu export dari `index.ts`
- Satu component per folder

---

## 🧱 Props & Emits Definition

### Props
```typescript
interface Props {
  // Prop name: Type
  // Required props (no default value)
  // Optional props (with withDefaults)
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}
```

### Emits
```typescript
defineEmits<{
  // Event name: payload type
  click: [value: string]
  update: [data: object]
}>()
```

### Defaults
Gunakan `withDefaults()` untuk optional props dengan nilai default

---

## 🏗️ Component Structure

Struktur component yang benar:

1. **Script Setup** - Logic & state
2. **Types/Interfaces** - Props, emits
3. **Functions** - Handlers & utilities
4. **Composables** - Reusable logic
5. **Computed Properties** - Derived state
6. **Template** - UI structure

---

## 🎨 Design & Styling

### Colors (Custom Scale)
- **Primary**: `primary-50` to `primary-950` (steps: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
- **Neutral**: `neutral-50` to `neutral-950`
- **Semantic**: `success-*`, `warning-*`, `danger-*`
- **Default brand**: `*-500` is the default/brand color (e.g., `bg-primary-500`)

**Contoh Tailwind Classes**:
- Borders: `border-neutral-100`, `border-neutral-200`
- Text: `text-neutral-950` (dark), `text-neutral-500` (medium)
- Backgrounds: `bg-neutral-50`, `bg-neutral-100`

### ⚠️ Rules:
- ✅ `:style` boleh digunakan jika nilainya memang dinamis dan tidak praktis direpresentasikan dengan class (mis. `height`, `width`, `diameter`, posisi, dll.)
- ❌ JANGAN gunakan Tailwind default colors (`gray-200`, `blue-500`)
- ✅ WAJIB gunakan custom color scale project

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm` (640), `tablet` (768), `tablet-landscape` (1024), `desktop` (1280), `wide` (1440)
- Test di berbagai ukuran layar

---

## 📋 Accessibility (A11y)

### Minimum Requirements
- [ ] Semantic HTML (`<button>`, `<label>`, dll, bukan `<div>`)
- [ ] ARIA labels untuk interactive elements
- [ ] Keyboard navigation support (Tab, Enter, Escape)
- [ ] Color contrast (WCAG AA minimum)
- [ ] Focus indicators visible
- [ ] Screen reader friendly

### Reka UI Integration
Gunakan Reka UI primitives untuk accessible behavior:
- Dialog, Popover, Dropdown → built-in a11y
- Form inputs → label association, error messages
- Notifications → role="alert"

---

## 🧪 Testing Requirements

### Unit Tests (Vitest + Vue Test Utils)
File: `test/[ComponentName].spec.ts`

**Test Coverage**:
- [ ] Props rendering & defaults
- [ ] Emits triggered correctly
- [ ] User interactions (click, input, etc.)
- [ ] Conditional rendering (loading, empty, error states)
- [ ] Accessibility attributes present

**Example**:
```typescript
describe('DataTable', () => {
  it('renders data correctly', () => {
    const wrapper = mount(DataTable, {
      props: { data: mockData }
    })
    expect(wrapper.text()).toContain('Item 1')
  })
  
  it('emits sort event', async () => {
    const wrapper = mount(DataTable, { props: { sortable: true } })
    await wrapper.find('[data-cy="sort-button"]').trigger('click')
    expect(wrapper.emitted('sort')).toBeTruthy()
  })
})
```

---

## 🔧 Composables (Jika Diperlukan)

### Kapan membuat composable:
- Logic reusable di multiple components
- State management kompleks
- Side effects (API calls, watchers)

### Struktur composable:
```typescript
// File: [componentName].ts
export function useComponentName(props: Props) {
  // State, computed, functions
  return {
    state,
    methods,
    computed
  }
}
```

---

## 📐 UI Specification

[TULIS DETAIL DESAIN DI SINI]

### Visual States
- [ ] Default state
- [ ] Hover state
- [ ] Active/Selected state
- [ ] Disabled state
- [ ] Loading state (jika applicable)
- [ ] Error state (jika applicable)
- [ ] Empty state (jika applicable)

### Responsive Behavior
- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)

---

## 📚 Documentation & Storybook

### Component JSDoc
```typescript
/**
 * DataTable component untuk menampilkan data terstruktur
 * dengan fitur sorting, filtering, dan pagination.
 * 
 * @component
 * @example
 * <DataTable :data="items" sortable paginated />
 */
```

### Storybook Story (jika diperlukan)
```typescript
export const Default: Story = {
  args: {
    data: mockData,
    sortable: true,
    paginated: true
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Component terbuat di lokasi yang tepat
- [ ] Props & emits terdefinisi dengan type-safe
- [ ] Styling menggunakan TailwindCSS dengan custom colors
- [ ] Accessible (keyboard nav, ARIA labels, semantic HTML)
- [ ] Unit tests di-include dengan 80%+ coverage
- [ ] Responsive di semua ukuran layar
- [ ] Export dari `index.ts`
- [ ] Ikuti function declaration rules & early returns
- [ ] Build & preview tidak error: `npm run build`

---