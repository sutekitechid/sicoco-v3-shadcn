<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">DataTable dengan Footer & Dynamic Colspan</h2>
    
    <div class="mb-4 text-sm text-muted-foreground">
      <p>Contoh ini menunjukkan bagaimana colspan menyesuaikan secara otomatis ketika kolom dihide.</p>
      <p>Kolom "Name" memiliki footer-colspan="3", tetapi akan berkurang jika kolom lain dihide.</p>
    </div>
    
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
      
      <!-- Name column with large footer colspan -->
      <DataTableColumn 
        field="name" 
        group="personal" 
        :order="1" 
        :body-colspan="1" 
        :footer-colspan="3"
      >
        <template #header>
          <span>Name</span>
        </template>
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
        <template #footer="{ data }">
          <div class="font-semibold text-blue-600">
            📊 Summary: {{ data.length }} employees with total salary ${{ calculateSum(data, 'salary').toLocaleString() }}
          </div>
        </template>
      </DataTableColumn>
      
      <!-- Age column - will be spanned by name footer -->
      <DataTableColumn 
        field="age" 
        group="personal" 
        :order="2" 
        :body-colspan="1" 
        :footer-colspan="0"
      >
        <template #header>
          <span>Age</span>
        </template>
        <template #default="{ row }">
          <span>{{ row.age }}</span>
        </template>
      </DataTableColumn>
      
      <!-- Salary column - will be spanned by name footer -->
      <DataTableColumn 
        field="salary" 
        :order="3" 
        :body-colspan="1" 
        :footer-colspan="0"
      >
        <template #header>
          <span>Salary</span>
        </template>
        <template #default="{ row }">
          <span>${{ row.salary.toLocaleString() }}</span>
        </template>
      </DataTableColumn>
      
      <!-- Department column with separate footer -->
      <DataTableColumn 
        field="department" 
        :order="4" 
        :body-colspan="1" 
        :footer-colspan="1"
      >
        <template #header>
          <span>Department</span>
        </template>
        <template #default="{ row }">
          <span>{{ row.department }}</span>
        </template>
        <template #footer="{ data }">
          <span class="font-semibold text-green-600">
            🏢 {{ getUniqueCount(data, 'department') }} depts
          </span>
        </template>
      </DataTableColumn>
    </DataTable>
    
    <div class="mt-4 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold mb-2">Test Dynamic Colspan:</h3>
      <p class="text-sm text-muted-foreground mb-2">
        Coba hide/show kolom menggunakan dropdown settings di header. 
        Perhatikan bagaimana footer "Name" menyesuaikan colspan secara otomatis.
      </p>
      <ul class="text-sm space-y-1">
        <li>• Footer "Name" awalnya span 3 kolom (Name + Age + Salary)</li>
        <li>• Jika kolom "Age" dihide, footer akan span 2 kolom</li>
        <li>• Jika kolom "Salary" juga dihide, footer akan span 1 kolom</li>
        <li>• Footer "Department" selalu independen dengan colspan 1</li>
      </ul>
    </div>
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
