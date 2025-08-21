<template>
  <div>
    <h2>DataTable with Default Sort Example</h2>
    <p>This example shows how columns can have default sorting using the 'defaultSort' prop.</p>
    
    <div class="mb-4">
      <p><strong>Default Sort Configuration:</strong></p>
      <ul class="list-disc list-inside text-sm text-gray-600">
        <li>Name column: defaultSort="asc" (Primary sort)</li>
        <li>Department column: defaultSort="desc" (Secondary sort in multiple sort mode)</li>
        <li>Salary column: defaultSort="desc" (Tertiary sort in multiple sort mode)</li>
      </ul>
    </div>

    <div class="mb-4">
      <label class="flex items-center">
        <input 
          v-model="multipleSort"
          type="checkbox" 
          class="mr-2"
        >
        Enable Multiple Sort (shows secondary/tertiary default sorts)
      </label>
    </div>
    
    <DataTable
      id="default-sort-datatable-example"
      :data="tableData"
      :persist-state="false"
      :multiple-sort="multipleSort"
      @sort="onSortChange"
    >
      <!-- Name column with default ascending sort (order: 1) -->
      <DataTableColumn
        field="name"
        :sortable="true"
        :order="1"
        default-sort="asc"
      >
        <template #header>Name (Default: ASC)</template>
        <template #default="{ row }">{{ row.name }}</template>
      </DataTableColumn>

      <!-- Department column with default descending sort (order: 2) -->
      <DataTableColumn
        field="department"
        :sortable="true"
        :order="2"
        default-sort="desc"
      >
        <template #header>Department (Default: DESC)</template>
        <template #default="{ row }">{{ row.department }}</template>
      </DataTableColumn>

      <!-- Position column - no default sort -->
      <DataTableColumn field="position" :sortable="true">
        <template #header>Position</template>
        <template #default="{ row }">{{ row.position }}</template>
      </DataTableColumn>

      <!-- Salary column with default descending sort (order: 3) -->
      <DataTableColumn
        field="salary"
        :sortable="true"
        :order="3"
        default-sort="desc"
      >
        <template #header>Salary (Default: DESC)</template>
        <template #default="{ row }">{{ formatCurrency(row.salary) }}</template>
      </DataTableColumn>

      <!-- Email column - no default sort -->
      <DataTableColumn field="email" :sortable="true">
        <template #header>Email</template>
        <template #default="{ row }">{{ row.email }}</template>
      </DataTableColumn>

      <!-- Status column - not sortable -->
      <DataTableColumn field="status">
        <template #header>Status</template>
        <template #default="{ row }">
          <span :class="getStatusClass(row.status)">
            {{ row.status }}
          </span>
        </template>
      </DataTableColumn>
    </DataTable>

    <!-- Display current sort state -->
    <div class="mt-4 p-4 bg-gray-100 rounded">
      <h3 class="font-semibold mb-2">Current Sort State:</h3>
      <pre class="text-sm">{{ JSON.stringify(currentSort, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '../DataTable.vue'
import DataTableColumn from '../DataTableColumn.vue'

// Reactive state
const multipleSort = ref(false)
const currentSort = ref([])

// Sample data
const tableData = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 95000,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    department: 'Design',
    position: 'UX Designer',
    salary: 75000,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 80000,
    status: 'Inactive'
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    department: 'Engineering',
    position: 'Frontend Developer',
    salary: 85000,
    status: 'Active'
  },
  {
    id: 5,
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    department: 'Sales',
    position: 'Sales Representative',
    salary: 65000,
    status: 'Active'
  },
  {
    id: 6,
    name: 'Diana Wilson',
    email: 'diana@example.com',
    department: 'Engineering',
    position: 'DevOps Engineer',
    salary: 90000,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Eve Miller',
    email: 'eve@example.com',
    department: 'Design',
    position: 'Graphic Designer',
    salary: 65000,
    status: 'Inactive'
  },
  {
    id: 8,
    name: 'Frank Garcia',
    email: 'frank@example.com',
    department: 'Marketing',
    position: 'Content Manager',
    salary: 70000,
    status: 'Active'
  }
])

// Event handlers
function onSortChange(sortState) {
  currentSort.value = sortState
  console.log('Sort changed:', sortState)
}

// Helper functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

function getStatusClass(status) {
  return status === 'Active' 
    ? 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs' 
    : 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs'
}
</script>

<style scoped>
.list-disc {
  list-style-type: disc;
}

.list-inside {
  list-style-position: inside;
}
</style>
