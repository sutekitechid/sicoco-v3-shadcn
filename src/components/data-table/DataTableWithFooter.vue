<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">DataTable dengan Footer</h2>
    
    <DataTable 
      :data="tableData" 
      :show-footer="true"
      :selectable="true"
      :show-numbering="true"
    >
      <!-- Define columns with footer -->
      <DataTableGroup name="personal" :order="1">
        <template #header>
          <span>Personal Info</span>
        </template>
      </DataTableGroup>
      
      <DataTableColumn field="name" group="personal" :order="1" :footer-colspan="2">
        <template #header>
          <span>Name</span>
        </template>
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
        <template #footer="{ data }">
          <span class="font-semibold">Total: {{ data.length }} records</span>
        </template>
      </DataTableColumn>
      
      <DataTableColumn field="age" group="personal" :order="2">
        <template #header>
          <span>Age</span>
        </template>
        <template #default="{ row }">
          <span>{{ row.age }}</span>
        </template>
        <template #footer="{ data }">
          <span class="font-semibold">Avg: {{ calculateAverage(data, 'age') }}</span>
        </template>
      </DataTableColumn>
      
      <DataTableColumn field="salary" :order="3">
        <template #header>
          <span>Salary</span>
        </template>
        <template #default="{ row }">
          <span>${{ row.salary.toLocaleString() }}</span>
        </template>
        <template #footer="{ data }">
          <span class="font-semibold">Total: ${{ calculateSum(data, 'salary').toLocaleString() }}</span>
        </template>
      </DataTableColumn>
      
      <DataTableColumn field="department" :order="4">
        <template #header>
          <span>Department</span>
        </template>
        <template #default="{ row }">
          <span>{{ row.department }}</span>
        </template>
        <template #footer="{ data }">
          <span class="font-semibold">{{ getUniqueCount(data, 'department') }} depts</span>
        </template>
      </DataTableColumn>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '@/components/datatablev2/DataTable.vue'
import DataTableColumn from '@/components/datatablev2/DataTableColumn.vue'
import DataTableGroup from '@/components/datatablev2/DataTableGroupColumn.vue'

const tableData = ref([
  { name: 'John Doe', age: 30, salary: 75000, department: 'Engineering' },
  { name: 'Jane Smith', age: 28, salary: 68000, department: 'Marketing' },
  { name: 'Bob Johnson', age: 35, salary: 82000, department: 'Engineering' },
  { name: 'Alice Brown', age: 32, salary: 71000, department: 'Sales' },
  { name: 'Charlie Wilson', age: 29, salary: 69000, department: 'Marketing' },
])

const calculateAverage = (data, field) => {
  const sum = data.reduce((acc, item) => acc + item[field], 0)
  return (sum / data.length).toFixed(1)
}

const calculateSum = (data, field) => {
  return data.reduce((acc, item) => acc + item[field], 0)
}

const getUniqueCount = (data, field) => {
  const unique = new Set(data.map(item => item[field]))
  return unique.size
}
</script>
