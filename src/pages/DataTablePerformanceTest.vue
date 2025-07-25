<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">DataTable Performance Test</h1>
    
    <!-- Performance Controls -->
    <div class="mb-6 flex gap-4">
      <button 
        @click="generateLargeDataset(1000)"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Generate 1,000 Rows
      </button>
      <button 
        @click="generateLargeDataset(5000)"
        class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        Generate 5,000 Rows
      </button>
      <button 
        @click="generateLargeDataset(10000)"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Generate 10,000 Rows
      </button>
      <button 
        @click="clearData"
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Clear Data
      </button>
    </div>

    <!-- Performance Info -->
    <div class="mb-4 p-4 bg-blue-50 rounded">
      <p class="text-sm text-blue-700">
        <strong>Current Dataset:</strong> {{ data.length }} rows
        <br>
        <strong>Virtual Scrolling:</strong> {{ isVirtualScrollActive ? 'Active' : 'Disabled' }}
        <br>
        <strong>Virtual Scroll Threshold:</strong> 100 rows
        <br>
        <strong>Optimization:</strong> Throttled scroll updates (~60fps) + smart change detection
        <br>
        <strong>Selected Rows:</strong> {{ selectedRows.length }}
        <br>
        <strong>Test:</strong> Scroll dalam tabel untuk melihat virtual scrolling bekerja. Row yang tidak terlihat tidak akan ter-render.
      </p>
    </div>

    <!-- DataTable with Performance Optimization -->
    <DataTable
      v-model="selectedRows"
      :data="data"
      :columns="columns"
      :virtual-scroll-threshold="100"
      :virtual-scroll-throttle="16"
      :row-height="60"
      scroll-y="400px"
      selectable
      show-numbering
      primary-key="id"
      class="border rounded-lg"
    />
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue';
import DataTable from '@/components/datatablev2/DataTable.vue';

// Sample data generation
const data = ref([]);
const selectedRows = ref([]);

// Sample columns configuration
const columns = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => row.name,
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    cell: ({ row }) => row.email,
  },
  {
    id: 'department',
    header: 'Department',
    accessorKey: 'department',
    cell: ({ row }) => row.department,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => h('span', {
      class: `px-2 py-1 rounded text-xs ${
        row.status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`
    }, row.status),
  },
  {
    id: 'joinDate',
    header: 'Join Date',
    accessorKey: 'joinDate',
    cell: ({ row }) => new Date(row.joinDate).toLocaleDateString(),
  }
];

// Sample departments and statuses
const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
const statuses = ['active', 'inactive'];

// Generate large dataset for performance testing
const generateLargeDataset = (count) => {
  const newData = [];
  for (let i = 1; i <= count; i++) {
    newData.push({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joinDate: new Date(2020 + Math.floor(Math.random() * 4), 
                        Math.floor(Math.random() * 12), 
                        Math.floor(Math.random() * 28) + 1).toISOString(),
    });
  }
  
  data.value = newData;
  selectedRows.value = [];
};

// Clear data
const clearData = () => {
  data.value = [];
  selectedRows.value = [];
};

// Computed property to check if virtual scroll is active
const isVirtualScrollActive = computed(() => {
  return data.value.length > 100; // Threshold for virtual scrolling
});

// Generate initial dataset that triggers virtual scroll
generateLargeDataset(150);
</script>
