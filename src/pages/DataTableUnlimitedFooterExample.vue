<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">DataTable Unlimited Footer Rows Example</h1>
    
    <DataTable 
      :data="salesData" 
      :show-footer="true"
      :show-numbering="false"
      id="unlimited-footer-table"
    >
      <!-- Product Column -->
      <DataTableColumn field="product">
        <template #header>
          <span class="font-semibold">Product</span>
        </template>
        <template #default="{ row }">
          <div class="font-medium">{{ row.product }}</div>
        </template>
        <template #footer>
          <div class="font-bold text-gray-800">TOTALS</div>
        </template>
        <template #footer2>
          <div class="font-medium text-blue-600">AVERAGES</div>
        </template>
        <template #footer3>
          <div class="font-medium text-green-600">MAXIMUMS</div>
        </template>
        <template #footer4>
          <div class="font-medium text-purple-600">MINIMUMS</div>
        </template>
        <template #footer5>
          <div class="font-medium text-red-600">RANGES</div>
        </template>
        <template #footer10>
          <div class="font-bold text-orange-600">CUSTOM ROW 10</div>
        </template>
        <template #footer25>
          <div class="font-bold text-pink-600">CUSTOM ROW 25</div>
        </template>
      </DataTableColumn>

      <!-- Q1 Sales Column -->
      <DataTableColumn field="q1">
        <template #header>
          <span class="font-semibold">Q1 Sales</span>
        </template>
        <template #default="{ row }">
          <div class="text-right">${{ formatNumber(row.q1) }}</div>
        </template>
        <template #footer="{ data }">
          <div class="text-right font-bold text-gray-800">
            ${{ formatNumber(calculateTotal(data, 'q1')) }}
          </div>
        </template>
        <template #footer2="{ data }">
          <div class="text-right font-medium text-blue-600">
            ${{ formatNumber(calculateAverage(data, 'q1')) }}
          </div>
        </template>
        <template #footer3="{ data }">
          <div class="text-right font-medium text-green-600">
            ${{ formatNumber(Math.max(...data.map(item => item.q1))) }}
          </div>
        </template>
        <template #footer4="{ data }">
          <div class="text-right font-medium text-purple-600">
            ${{ formatNumber(Math.min(...data.map(item => item.q1))) }}
          </div>
        </template>
        <template #footer5="{ data }">
          <div class="text-right font-medium text-red-600">
            ${{ formatNumber(Math.max(...data.map(item => item.q1)) - Math.min(...data.map(item => item.q1))) }}
          </div>
        </template>
        <template #footer10="{ data }">
          <div class="text-right font-bold text-orange-600">
            ${{ formatNumber(calculateTotal(data, 'q1') * 1.1) }}
          </div>
        </template>
        <template #footer25="{ data }">
          <div class="text-right font-bold text-pink-600">
            Projection: ${{ formatNumber(calculateTotal(data, 'q1') * 1.25) }}
          </div>
        </template>
      </DataTableColumn>

      <!-- Q2 Sales Column -->
      <DataTableColumn field="q2">
        <template #header>
          <span class="font-semibold">Q2 Sales</span>
        </template>
        <template #default="{ row }">
          <div class="text-right">${{ formatNumber(row.q2) }}</div>
        </template>
        <template #footer="{ data }">
          <div class="text-right font-bold text-gray-800">
            ${{ formatNumber(calculateTotal(data, 'q2')) }}
          </div>
        </template>
        <template #footer2="{ data }">
          <div class="text-right font-medium text-blue-600">
            ${{ formatNumber(calculateAverage(data, 'q2')) }}
          </div>
        </template>
        <template #footer3="{ data }">
          <div class="text-right font-medium text-green-600">
            ${{ formatNumber(Math.max(...data.map(item => item.q2))) }}
          </div>
        </template>
        <template #footer4="{ data }">
          <div class="text-right font-medium text-purple-600">
            ${{ formatNumber(Math.min(...data.map(item => item.q2))) }}
          </div>
        </template>
        <template #footer5="{ data }">
          <div class="text-right font-medium text-red-600">
            ${{ formatNumber(Math.max(...data.map(item => item.q2)) - Math.min(...data.map(item => item.q2))) }}
          </div>
        </template>
        <template #footer10="{ data }">
          <div class="text-right font-bold text-orange-600">
            ${{ formatNumber(calculateTotal(data, 'q2') * 1.1) }}
          </div>
        </template>
        <template #footer25="{ data }">
          <div class="text-right font-bold text-pink-600">
            Projection: ${{ formatNumber(calculateTotal(data, 'q2') * 1.25) }}
          </div>
        </template>
      </DataTableColumn>

      <!-- Q3 Sales Column -->
      <DataTableColumn field="q3">
        <template #header>
          <span class="font-semibold">Q3 Sales</span>
        </template>
        <template #default="{ row }">
          <div class="text-right">${{ formatNumber(row.q3) }}</div>
        </template>
        <template #footer="{ data }">
          <div class="text-right font-bold text-gray-800">
            ${{ formatNumber(calculateTotal(data, 'q3')) }}
          </div>
        </template>
        <template #footer2="{ data }">
          <div class="text-right font-medium text-blue-600">
            ${{ formatNumber(calculateAverage(data, 'q3')) }}
          </div>
        </template>
        <template #footer3="{ data }">
          <div class="text-right font-medium text-green-600">
            ${{ formatNumber(Math.max(...data.map(item => item.q3))) }}
          </div>
        </template>
        <template #footer4="{ data }">
          <div class="text-right font-medium text-purple-600">
            ${{ formatNumber(Math.min(...data.map(item => item.q3))) }}
          </div>
        </template>
        <template #footer5="{ data }">
          <div class="text-right font-medium text-red-600">
            ${{ formatNumber(Math.max(...data.map(item => item.q3)) - Math.min(...data.map(item => item.q3))) }}
          </div>
        </template>
        <template #footer10="{ data }">
          <div class="text-right font-bold text-orange-600">
            ${{ formatNumber(calculateTotal(data, 'q3') * 1.1) }}
          </div>
        </template>
        <template #footer25="{ data }">
          <div class="text-right font-bold text-pink-600">
            Projection: ${{ formatNumber(calculateTotal(data, 'q3') * 1.25) }}
          </div>
        </template>
      </DataTableColumn>

      <!-- Q4 Sales Column -->
      <DataTableColumn field="q4">
        <template #header>
          <span class="font-semibold">Q4 Sales</span>
        </template>
        <template #default="{ row }">
          <div class="text-right">${{ formatNumber(row.q4) }}</div>
        </template>
        <template #footer="{ data }">
          <div class="text-right font-bold text-gray-800">
            ${{ formatNumber(calculateTotal(data, 'q4')) }}
          </div>
        </template>
        <template #footer2="{ data }">
          <div class="text-right font-medium text-blue-600">
            ${{ formatNumber(calculateAverage(data, 'q4')) }}
          </div>
        </template>
        <template #footer3="{ data }">
          <div class="text-right font-medium text-green-600">
            ${{ formatNumber(Math.max(...data.map(item => item.q4))) }}
          </div>
        </template>
        <template #footer4="{ data }">
          <div class="text-right font-medium text-purple-600">
            ${{ formatNumber(Math.min(...data.map(item => item.q4))) }}
          </div>
        </template>
        <template #footer5="{ data }">
          <div class="text-right font-medium text-red-600">
            ${{ formatNumber(Math.max(...data.map(item => item.q4)) - Math.min(...data.map(item => item.q4))) }}
          </div>
        </template>
        <template #footer10="{ data }">
          <div class="text-right font-bold text-orange-600">
            ${{ formatNumber(calculateTotal(data, 'q4') * 1.1) }}
          </div>
        </template>
        <template #footer25="{ data }">
          <div class="text-right font-bold text-pink-600">
            Projection: ${{ formatNumber(calculateTotal(data, 'q4') * 1.25) }}
          </div>
        </template>
      </DataTableColumn>

      <!-- Growth Rate Column - Only some footers -->
      <DataTableColumn field="growth">
        <template #header>
          <span class="font-semibold">Growth %</span>
        </template>
        <template #default="{ row }">
          <div class="text-center">
            <span 
              :class="getGrowthClass(row.growth)"
              class="px-2 py-1 rounded text-sm font-medium"
            >
              {{ row.growth }}%
            </span>
          </div>
        </template>
        <template #footer2="{ data }">
          <div class="text-center font-medium text-blue-600">
            {{ formatNumber(calculateAverage(data, 'growth')) }}%
          </div>
        </template>
        <template #footer3="{ data }">
          <div class="text-center font-medium text-green-600">
            {{ Math.max(...data.map(item => item.growth)) }}%
          </div>
        </template>
        <template #footer25="{ data }">
          <div class="text-center font-bold text-pink-600">
            Target: {{ formatNumber(calculateAverage(data, 'growth') * 1.5) }}%
          </div>
        </template>
      </DataTableColumn>
    </DataTable>

    <div class="mt-8 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Unlimited Footer Rows Features:</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 class="font-medium mb-2">Dynamic Detection:</h4>
          <ul class="space-y-1 text-sm text-gray-700">
            <li>• Automatically detects all <code>#footer{N}</code> templates</li>
            <li>• Supports any number: <code>#footer</code>, <code>#footer2</code>, <code>#footer10</code>, <code>#footer25</code></li>
            <li>• No limit on number of footer rows</li>
            <li>• Sorted automatically by footer number</li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium mb-2">Smart Rendering:</h4>
          <ul class="space-y-1 text-sm text-gray-700">
            <li>• Only renders footer rows with content</li>
            <li>• Skips empty footer rows automatically</li>
            <li>• Selective column participation</li>
            <li>• Backward compatible with single <code>#footer</code></li>
          </ul>
        </div>
      </div>
      
      <div class="mt-4">
        <h4 class="font-medium mb-2">Example Usage:</h4>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto"><code>&lt;DataTableColumn field="sales"&gt;
  &lt;template #footer="{ data }"&gt;Total: {{ '{{ sum(data) }}' }}&lt;/template&gt;
  &lt;template #footer2="{ data }"&gt;Avg: {{ '{{ avg(data) }}' }}&lt;/template&gt;
  &lt;template #footer3="{ data }"&gt;Max: {{ '{{ max(data) }}' }}&lt;/template&gt;
  &lt;template #footer10="{ data }"&gt;Custom: {{ '{{ custom(data) }}' }}&lt;/template&gt;
  &lt;template #footer100="{ data }"&gt;Special: {{ '{{ special(data) }}' }}&lt;/template&gt;
&lt;/DataTableColumn&gt;</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DataTable, DataTableColumn } from '@/lib/components/datatablev2'

const salesData = ref([
  {
    id: 1,
    product: 'Laptop Pro X1',
    q1: 125000,
    q2: 132000,
    q3: 145000,
    q4: 158000,
    growth: 8.5
  },
  {
    id: 2,
    product: 'Smartphone Elite',
    q1: 89000,
    q2: 95000,
    q3: 102000,
    q4: 115000,
    growth: 12.3
  },
  {
    id: 3,
    product: 'Tablet Ultra',
    q1: 67000,
    q2: 72000,
    q3: 68000,
    q4: 75000,
    growth: 4.2
  },
  {
    id: 4,
    product: 'Smart Watch Series',
    q1: 45000,
    q2: 48000,
    q3: 52000,
    q4: 58000,
    growth: 15.7
  },
  {
    id: 5,
    product: 'Wireless Earbuds',
    q1: 34000,
    q2: 39000,
    q3: 43000,
    q4: 49000,
    growth: 18.9
  }
])

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value)
}

function calculateTotal(data, field) {
  return data.reduce((sum, item) => sum + item[field], 0)
}

function calculateAverage(data, field) {
  const total = calculateTotal(data, field)
  return Math.round(total / data.length)
}

function getGrowthClass(growth) {
  if (growth >= 15) return 'bg-green-100 text-green-800'
  if (growth >= 10) return 'bg-blue-100 text-blue-800'
  if (growth >= 5) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}
</script>
