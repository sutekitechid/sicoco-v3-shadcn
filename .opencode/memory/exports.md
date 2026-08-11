# Export Registry

How `lib/main.ts` works and the S-prefix convention.

## Convention

All public exports use the `S` prefix:

```ts
export { Button as SButton } from './components/button'
export { Input as SInput } from './components/input'
```

Compound components export all sub-components:

```ts
export { Dialog as SDialog } from './components/dialog'
export { DialogContent as SDialogContent } from './components/dialog'
export { DialogHeader as SDialogHeader } from './components/dialog'
export { DialogTitle as SDialogTitle } from './components/dialog'
export { DialogDescription as SDialogDescription } from './components/dialog'
export { DialogFooter as SDialogFooter } from './components/dialog'
```

## Utility Exports

Utilities are exported as-is (no S prefix):

```ts
export * from './utils/tw-merge'
export * from './utils/currency'
export * from './utils/file'
export * from './utils/pagination'
export * from './utils/sanitize-html'
```

## Composable Exports

Composables use `use` prefix:

```ts
export { useToast } from '@/components/toast'
export { useCarousel as useSCarousel } from './components/carousel'
```

## Constants

```ts
export { SORT_DIRECTION, PIN_DIRECTION } from './components/datatablev2'
```

## Adding a New Export

1. Add to `lib/main.ts` with `S` prefix
2. Follow existing patterns for the component type
3. If compound component, export all sub-components
4. If composable, use `use` prefix (optionally `useS` prefix)

## Currently Exported Components

Accordion, Alert, Badge, BaseInput, Breadcrumb, Button, Calendar, Card, Carousel, Checkbox, DataTable, DatePicker, Dialog, Dropdown, EmptyDataMessage, Field, FormInput, Input, Label, Loading, MonthPicker, NavigationMenu, Pagination, PinInput, Progress, ProgressCircle, Radio, RangeCalendar, RichEditor, Sidemenu, Skeleton, Stepper, Switch, Table, Tabs, Textarea, TimePicker, Toast, Tooltip, Upload, VirtualScroll, YearPicker
