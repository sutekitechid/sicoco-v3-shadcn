<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">DataTable with Sorting Example</h2>
    
    <!-- Sorting Info Display -->
    <div v-if="currentSort.length > 0" class="p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold mb-2">Current Sort:</h3>
      <div class="space-y-1">
        <div v-for="(sort, index) in currentSort" :key="sort.id" class="text-sm">
          <span class="font-medium">{{ index + 1 }}.</span>
          Field: <code class="bg-blue-100 px-1 rounded-sm">{{ sort.id }}</code> -
          Direction: <span :class="sort.desc ? 'text-red-600' : 'text-green-600'">
            {{ sort.desc ? 'Descending' : 'Ascending' }}
          </span>
        </div>
      </div>
      <button 
        @click="clearTableSort"
        class="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-sm hover:bg-red-200"
      >
        Clear All Sorting
      </button>
    </div>

    <!-- DataTable with sorting enabled -->
    <DataTable
      id="sortable-table"
      ref="tableRef"
      :data="tableData"
      :multiple-sort="true"
      :sticky-headers="true"
      scroll-y="400px"
      @sort-change="onSortChange"
    >
      <!-- Define table structure -->
      <DataTableGroup name="info" label="Basic Info" :order="1">
        <template #header>
          <span class="font-semibold">Basic Information</span>
        </template>
        <DataTableColumn field="name" group="info" :order="1" :sortable="true">
          <template #header>
            <span class="font-semibold">Name</span>
          </template>
          <template #default="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </DataTableColumn>
        <DataTableColumn field="email" group="info" :order="2">
          <template #header>
            <span class="font-semibold">Email</span>
          </template>
          <template #default="{ row }">
            <span>{{ row.email }}</span>
          </template>
        </DataTableColumn>
      </DataTableGroup>

      <DataTableGroup name="details" label="Details" :order="2">
        <template #header>
          <span class="font-semibold">Details</span>
        </template>
        <DataTableColumn field="age" group="details" :order="1" :sortable="true">
          <template #header>
            <span class="font-semibold">Age</span>
          </template>
          <template #default="{ row }">
            <span>{{ row.age }}</span>
          </template>
        </DataTableColumn>
        <DataTableColumn field="city" group="details" :order="2" :sortable="true">
          <template #header>
            <span class="font-semibold">City</span>
          </template>
          <template #default="{ row }">
            <span>{{ row.city }}</span>
          </template>
        </DataTableColumn>
      </DataTableGroup>

      <DataTableColumn field="status" label="Status" :order="3" :sortable="true">
        <template #header>
          <span class="font-semibold">Status</span>
        </template>
        <template #default="{ row }">
          <span>{{ row.status }}</span>
        </template>
    </DataTableColumn>
  </DataTable>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { DataTable, DataTableGroupColumn as DataTableGroup, DataTableColumn } from '../../lib/components/datatablev2'

const tableRef = ref()
const currentSort = ref([])

// Sample data
const tableData = ref([
  { name: 'John Doe', email: 'john@example.com', age: 30, city: 'New York', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@example.com', age: 25, city: 'Los Angeles', status: 'Inactive' },
  { name: 'Bob Johnson', email: 'bob@example.com', age: 35, city: 'Chicago', status: 'Active' },
  { name: 'Alice Brown', email: 'alice@example.com', age: 28, city: 'Houston', status: 'Pending' },
  { name: 'Charlie Davis', email: 'charlie@example.com', age: 32, city: 'Phoenix', status: 'Active' },
  { name: 'Diana Wilson', email: 'diana@example.com', age: 27, city: 'Seattle', status: 'Active' },
  { name: 'Edward Miller', email: 'edward@example.com', age: 42, city: 'Boston', status: 'Inactive' },
  { name: 'Fiona Garcia', email: 'fiona@example.com', age: 29, city: 'Miami', status: 'Active' },
  { name: 'George Martinez', email: 'george@example.com', age: 38, city: 'Denver', status: 'Pending' },
  { name: 'Helen Rodriguez', email: 'helen@example.com', age: 31, city: 'Atlanta', status: 'Active' },
  { name: 'Ivan Lopez', email: 'ivan@example.com', age: 26, city: 'Portland', status: 'Inactive' },
  { name: 'Julia Hernandez', email: 'julia@example.com', age: 33, city: 'San Diego', status: 'Active' },
  { name: 'Kevin Lee', email: 'kevin@example.com', age: 39, city: 'Austin', status: 'Pending' },
  { name: 'Lisa Wang', email: 'lisa@example.com', age: 24, city: 'Nashville', status: 'Active' },
  { name: 'Michael Chen', email: 'michael@example.com', age: 36, city: 'San Francisco', status: 'Inactive' }
])

const onSortChange = (sortData) => {
  console.log('Sort changed:', sortData)
  currentSort.value = sortData
  
  // Here you would typically apply the sorting to your data
  // For example, call an API or sort the local data
}

const clearTableSort = () => {
  if (tableRef.value) {
    tableRef.value.clearSort()
  }
}
</script>
