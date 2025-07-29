<template>
  <div>
    <h2>DataTable with Pin Props Example</h2>
    <p>This example shows how columns can be automatically pinned using the 'pin' prop.</p>
    
    <DataTable
      id="pinned-datatable-example"
      :data="tableData"
      :persist-state="true"
    >
      <!-- Pinned Left Column -->
      <DataTableColumn
        field="id"
        pin="left"
        :sortable="true"
      >
        <template #header>ID (Pinned Left)</template>
        <template #default="{ row }">{{ row.id }}</template>
      </DataTableColumn>

      <!-- Pinned Left Group -->
      <DataTableGroupColumn name="user_info" pin="left">
        <template #header>User Info (Pinned Left)</template>
        
        <DataTableColumn field="name" :sortable="true">
          <template #header>Name</template>
          <template #default="{ row }">{{ row.name }}</template>
        </DataTableColumn>
        
        <DataTableColumn field="email">
          <template #header>Email</template>
          <template #default="{ row }">{{ row.email }}</template>
        </DataTableColumn>
      </DataTableGroupColumn>

      <!-- Regular Columns -->
      <DataTableColumn field="department" :sortable="true">
        <template #header>Department</template>
        <template #default="{ row }">{{ row.department }}</template>
      </DataTableColumn>

      <DataTableColumn field="position">
        <template #header>Position</template>
        <template #default="{ row }">{{ row.position }}</template>
      </DataTableColumn>

      <DataTableColumn field="salary">
        <template #header>Salary</template>
        <template #default="{ row }">{{ formatCurrency(row.salary) }}</template>
      </DataTableColumn>

      <!-- Pinned Right Group -->
      <DataTableGroupColumn name="actions" pin="right">
        <template #header>Actions (Pinned Right)</template>
        
        <DataTableColumn field="status">
          <template #header>Status</template>
          <template #default="{ row }">
            <span :class="getStatusClass(row.status)">
              {{ row.status }}
            </span>
          </template>
        </DataTableColumn>
        
        <DataTableColumn field="edit">
          <template #header>Edit</template>
          <template #default="{ row }">
            <button class="btn-primary" @click="editUser(row)">Edit</button>
          </template>
        </DataTableColumn>
      </DataTableGroupColumn>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '../DataTable.vue'
import DataTableColumn from '../DataTableColumn.vue'
import DataTableGroupColumn from '../DataTableGroupColumn.vue'

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
  }
])

// Helper functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

function getStatusClass(status) {
  return status === 'Active' 
    ? 'text-green-600 bg-green-100 px-2 py-1 rounded' 
    : 'text-red-600 bg-red-100 px-2 py-1 rounded'
}

function editUser(row) {
  alert(`Editing user: ${row.name}`)
}
</script>

<style scoped>
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #2563eb;
}
</style>
