<template>
  <div class="p-4">
    <!-- Debug Info -->
    <div class="mb-4 p-3 bg-gray-100 rounded text-sm">
      <strong>Debug Info:</strong><br />
      Current Page: {{ currentPage }}<br />
      Per Page: {{ perPage }}<br />
      Displayed Data Length: {{ displayedData.length }}<br />
      Total Available: {{ mockApiData.length }}<br />
      Loading: {{ isLoading }}<br />
      Has More Data: {{ hasMoreData }}
    </div>

    <DataTable
      v-model:page="currentPage"
      v-model:per-page="perPage"
      :data="displayedData"
      :show-numbering="true"
      :loading="isLoading"
      :infinite-scroll="true"
      :total="mockApiData.length"
      scroll-y="400px"
    >
      <DataTableColumn field="name" :order="1">
        <template #header>
          <span>Name</span>
        </template>
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </DataTableColumn>

      <DataTableColumn field="age" :order="2">
        <template #header>
          <span>Age</span>
        </template>
        <template #default="{ row }">
          {{ row.age }}
        </template>
      </DataTableColumn>

      <DataTableColumn field="salary" :order="3">
        <template #header>
          <span>Salary</span>
        </template>
        <template #default="{ row }">
          <span>${{ row.salary.toLocaleString() }}</span>
        </template>
      </DataTableColumn>

      <DataTableColumn field="department" :order="4">
        <template #header>
          <span>Department</span>
        </template>
        <template #default="{ row }">
          <span>{{ row.department }}</span>
        </template>
      </DataTableColumn>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DataTable from '../../lib/components/datatablev2/DataTable.vue'
import DataTableColumn from '../../lib/components/datatablev2/DataTableColumn.vue'

// Mock data - simulating API response
const mockApiData = [
  { name: 'John Doe', age: 30, salary: 75000, department: 'Engineering' },
  { name: 'Jane Smith', age: 28, salary: 68000, department: 'Marketing' },
  { name: 'Bob Johnson', age: 35, salary: 82000, department: 'Engineering' },
  { name: 'Alice Brown', age: 32, salary: 71000, department: 'Sales' },
  { name: 'Charlie Wilson', age: 29, salary: 69000, department: 'Marketing' },
  { name: 'David Miller', age: 31, salary: 73000, department: 'Engineering' },
  { name: 'Emily Davis', age: 27, salary: 65000, department: 'Marketing' },
  { name: 'Frank Garcia', age: 33, salary: 78000, department: 'Sales' },
  { name: 'Grace Martinez', age: 30, salary: 72000, department: 'Engineering' },
  { name: 'Henry Rodriguez', age: 34, salary: 80000, department: 'Sales' },
  { name: 'Ivy Lewis', age: 26, salary: 63000, department: 'Marketing' },
  { name: 'Jack Lee', age: 36, salary: 85000, department: 'Engineering' },
  { name: 'Kate Walker', age: 28, salary: 67000, department: 'Sales' },
  { name: 'Liam Hall', age: 32, salary: 74000, department: 'Marketing' },
  { name: 'Maya Young', age: 29, salary: 70000, department: 'Engineering' },
  { name: 'Noah Anderson', age: 37, salary: 88000, department: 'Engineering' },
  { name: 'Olivia Thompson', age: 25, salary: 62000, department: 'Marketing' },
  { name: 'Paul White', age: 38, salary: 91000, department: 'Sales' },
  { name: 'Quinn Harris', age: 31, salary: 76000, department: 'Engineering' },
  { name: 'Rachel Clark', age: 33, salary: 79000, department: 'Sales' },
  { name: 'Samuel Lewis', age: 28, salary: 66000, department: 'Marketing' },
  { name: 'Tina Robinson', age: 35, salary: 83000, department: 'Engineering' },
  { name: 'Ulysses Walker', age: 29, salary: 71000, department: 'Sales' },
  { name: 'Victoria Hall', age: 32, salary: 77000, department: 'Marketing' },
  { name: 'William Allen', age: 39, salary: 95000, department: 'Engineering' },
  { name: 'Xara Young', age: 26, salary: 64000, department: 'Marketing' },
  { name: 'Yolanda King', age: 34, salary: 81000, department: 'Sales' },
  { name: 'Zachary Wright', age: 31, salary: 75000, department: 'Engineering' },
  { name: 'Amanda Green', age: 27, salary: 65000, department: 'Marketing' },
  { name: 'Brian Adams', age: 36, salary: 86000, department: 'Engineering' },
  { name: 'Catherine Baker', age: 30, salary: 73000, department: 'Sales' },
  { name: 'Daniel Evans', age: 33, salary: 78000, department: 'Marketing' },
  { name: 'Elena Mitchell', age: 28, salary: 67000, department: 'Sales' },
  { name: 'Felix Carter', age: 35, salary: 84000, department: 'Engineering' },
  { name: 'Gloria Perez', age: 29, salary: 69000, department: 'Marketing' },
  {
    name: 'Harrison Roberts',
    age: 37,
    salary: 89000,
    department: 'Engineering',
  },
  { name: 'Isabella Turner', age: 26, salary: 63000, department: 'Sales' },
  { name: 'James Phillips', age: 34, salary: 80000, department: 'Marketing' },
  { name: 'Kelly Campbell', age: 31, salary: 74000, department: 'Engineering' },
  { name: 'Lucas Parker', age: 28, salary: 68000, department: 'Sales' },
  { name: 'Monica Edwards', age: 32, salary: 76000, department: 'Marketing' },
  { name: 'Nathan Collins', age: 36, salary: 87000, department: 'Engineering' },
  { name: 'Ophelia Stewart', age: 27, salary: 66000, department: 'Sales' },
  { name: 'Patrick Sanchez', age: 33, salary: 79000, department: 'Marketing' },
  { name: 'Rebecca Morris', age: 30, salary: 72000, department: 'Engineering' },
  { name: 'Steven Rogers', age: 35, salary: 82000, department: 'Sales' },
  { name: 'Teresa Reed', age: 29, salary: 70000, department: 'Marketing' },
  { name: 'Victor Cook', age: 38, salary: 92000, department: 'Engineering' },
  { name: 'Wendy Bailey', age: 31, salary: 75000, department: 'Sales' },
  { name: 'Xavier Rivera', age: 28, salary: 67000, department: 'Marketing' },
  { name: 'Yvonne Cooper', age: 34, salary: 81000, department: 'Engineering' },
]

// State
const displayedData = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const perPage = ref(10)

// Computed
const hasMoreData = computed(() => {
  return displayedData.value.length < mockApiData.length
})

// Functions
const loadInitialData = async () => {
  isLoading.value = true

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Load first page
  const firstPageData = mockApiData.slice(0, perPage.value)
  displayedData.value = firstPageData

  isLoading.value = false
}

const loadMoreData = async () => {
  if (!hasMoreData.value || isLoading.value) return

  isLoading.value = true

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Load next page data
  const startIndex = displayedData.value.length
  const endIndex = startIndex + perPage.value
  const newData = mockApiData.slice(startIndex, endIndex)

  // Append new data
  displayedData.value = [...displayedData.value, ...newData]

  isLoading.value = false
}

// Watch for page changes (infinite scroll will increment the page)
watch(currentPage, (newPage, oldPage) => {
  console.log('Page changed from', oldPage, 'to', newPage)
  if (newPage > oldPage && displayedData.value.length > 0) {
    loadMoreData()
  }
})

// Initialize
onMounted(() => {
  loadInitialData()
})
</script>
