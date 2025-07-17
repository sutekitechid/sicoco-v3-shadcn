<template>
  <Dropdown :scrollable="false" class="relative" append-to-body>
    <template #trigger>
      <Button
        variant="outline"
        size="sm"
        class="relative hidden group-hover:flex"
      >
        <i class="si-menu-alt text-neutral-90"></i>
      </Button>
    </template>
    
    <!-- Hide Column (only for leaf columns, not for group headers) -->
    <DropdownItem v-if="showHideColumn && !isGroupHeader" :value="null" @click="$emit('hide-column', columnField)">
      <p class="font-semibold w-full">Hide Column</p>
    </DropdownItem>
    
    <!-- Pin Column Options (UI Only) -->
    <template v-if="showPinOptions && columnField">
      <DropdownItem :value="null" @click="$emit('pin-left', columnField)">
        <p class="w-full">📌 Pin Left</p>
      </DropdownItem>
      
      <DropdownItem :value="null" @click="$emit('pin-right', columnField)">
        <p class="w-full">📌 Pin Right</p>
      </DropdownItem>
      
      <DropdownItem :value="null" @click="$emit('unpin', columnField)">
        <p class="w-full">📌 Unpin</p>
      </DropdownItem>
    </template>
    
    <!-- Visible Columns -->
    <Dropdown
      v-if="showColumnVisibility"
      side="right"
      align="start"
      multiple
      class="z-[60]"
      :model-value="columnVisibility"
      @update:model-value="$emit('update:column-visibility', $event)"
    >
      <template #trigger>
        <p class="p-2 hover:bg-neutral-10 w-full text-sm">Visible columns</p>
      </template>
      <DropdownItem
        v-for="column in allLeafColumns"
        :key="column.field"
        :value="column.field"
        :disabled="!column.enableHiding"
      >
        {{ getColumnDisplayName(column) }}
      </DropdownItem>
    </Dropdown>
    
    <!-- Row Size -->
    <DataTableColumnSizeDropdown
      v-if="showRowSize"
      class="w-full"
      :model-value="rowSize"
      @update:model-value="$emit('update:row-size', $event)"
    />
    
    <!-- Reset Table -->
    <DropdownItem v-if="showReset" :value="null" @click="$emit('reset-table')">
      <p class="font-semibold w-full">Reset Table</p>
    </DropdownItem>
  </Dropdown>
</template>

<script setup>
import {
  Dropdown,
  DropdownItem,
} from '../dropdown'
import { Button } from '../button'
import DataTableColumnSizeDropdown from './DataTableColumnSizeDropdown.vue'

defineProps({
  // Data
  columnVisibility: {
    type: Array,
    default: () => []
  },
  allLeafColumns: {
    type: Array,
    default: () => []
  },
  rowSize: {
    type: String,
    required: true
  },
  columnField: {
    type: String,
    default: null
  },
  
  // Display options
  showHideColumn: {
    type: Boolean,
    default: true
  },
  showColumnVisibility: {
    type: Boolean,
    default: true
  },
  showRowSize: {
    type: Boolean,
    default: true
  },
  showReset: {
    type: Boolean,
    default: true
  },
  showPinOptions: {
    type: Boolean,
    default: true
  },
  isGroupHeader: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'hide-column',
  'update:column-visibility', 
  'update:row-size',
  'reset-table',
  'pin-left',
  'pin-right',
  'unpin'
])

// Helper function untuk display name
const getColumnDisplayName = (column) => {
  if (column.headerText) return column.headerText
  if (column.field) return column.field.charAt(0).toUpperCase() + column.field.slice(1)
  return 'Unknown Column'
}
</script>
