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
      <DataTableColumnGroup name="personal" :order="1">
        <template #header>
          <span>Personal Info</span>
        </template>
      </DataTableColumnGroup>
      
      <DataTableColumn field="name" group="personal" :order="1" :body-colspan="1" :footer-colspan="2">
        <template #header>
          <span>Name</span>
        </template>
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
        <template #footer="{ data }">
          <span class="font-semibold">Total: {{ data.length }} records (spans 2 cols)</span>
        </template>
      </DataTableColumn>
      
      <DataTableColumn field="age" group="personal" :order="2" :body-colspan="1" :footer-colspan="0">
        <template #header>
          <span>Age</span>
        </template>
        <template #default="{ row }">
          <span>{{ row.age }}</span>
        </template>
        <!-- Footer content is handled by name column due to footer-colspan="0" -->
      </DataTableColumn>
      
      <DataTableColumn field="salary" :order="3" :body-colspan="1" :footer-colspan="1">
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
      
      <DataTableColumn field="department" :order="4" :body-colspan="1" :footer-rowspan="2">
        <template #header>
          <span>Department</span>
        </template>
        <template #default="{ row }">
          <span>{{ row.department }}</span>
        </template>
        <template #footer="{ data }">
          <div class="space-y-1">
            <div class="font-semibold">{{ getUniqueCount(data, 'department') }} departments</div>
            <div class="text-sm text-muted-foreground">Multi-row footer</div>
          </div>
        </template>
      </DataTableColumn>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '../DataTable.vue'
import DataTableColumn from '../DataTableColumn.vue'
import DataTableColumnGroup from '../DataTableColumnGroup.vue'

const tableData = ref([
  { name: 'John Doe', age: 30, salary: 75000, department: 'Engineering' },
  { name: 'Jane Smith', age: 28, salary: 68000, department: 'Marketing' },
  { name: 'Bob Johnson', age: 35, salary: 82000, department: 'Engineering' },
  { name: 'Alice Brown', age: 32, salary: 71000, department: 'Sales' },
  { name: 'Charlie Wilson', age: 29, salary: 69000, department: 'Marketing' },
])

const calculateSum = (data, field) => {
  return data.reduce((acc, item) => acc + item[field], 0)
}

const getUniqueCount = (data, field) => {
  const unique = new Set(data.map(item => item[field]))
  return unique.size
}
</script>
