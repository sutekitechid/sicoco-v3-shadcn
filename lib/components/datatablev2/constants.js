// Constants for DataTable component
export const TABLE_CONSTANTS = {
  // Column dimensions
  DEFAULT_COLUMN_WIDTH: 120,
  DEFAULT_MIN_COLUMN_WIDTH: '120px',
  
  // Storage keys prefix
  STORAGE_PREFIX: 'datatable',
  
  // CSS Classes
  PINNED_CLASSES: {
    BASE: 'sticky z-20 bg-white dark:bg-neutral-100',
    LEFT: 'left-0',
    RIGHT: 'right-0',
    HEADER_BORDER_LEFT: 'border-r border-border',
    HEADER_BORDER_RIGHT: 'border-l border-border'
  },
  
  // Default values
  DEFAULTS: {
    PERSIST_STATE: true,
    ENABLE_COLUMN_VISIBILITY: true,
    ENABLE_HORIZONTAL_SCROLL: true,
    TABLE_MIN_WIDTH: 'full',
    TABLE_ID: 'datatable'
  }
}
