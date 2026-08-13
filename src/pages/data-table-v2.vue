<template>
	<div class="p-4">
		<p class="text-2xl font-semibold mb-4 text-danger-default">
			Maha Karya
			<a
				class="text-3xl font-bold hover:text-danger-default hover:text-5xl transition-all duration-300 animate-pulse"
				target="_blank"
				href="https://www.linkedin.com/in/maulana-irfan-firdian/"
				>Maulana Irfan Firdian</a
			>
		</p>
		<span class="text-xs text-gray-500 ml-2 animate-pulse">
			(do you like surprise?, hover my name)
		</span>

		<!-- Modal Trigger Button -->
		<div class="mb-6">
			<Button variant="default" size="default" @click="isModalOpen = true">
				Open Data Modal
			</Button>
			<Dialog v-model:open="isModalOpen">
				<DialogContent class="max-w-4xl">
					<h2 class="text-xl font-semibold mb-4">Modal Data Table</h2>
					<DataTable
						v-model:page="modalPage"
						v-model:per-page="modalPerPage"
						:data="modalData"
						:show-numbering="true"
						:loading="isModalLoading"
						:paginated="true"
						:total="mockApiData.length"
						:infinite-scroll="false"
						show-footer
					>
						<DataTableColumn field="name" :order="1">
							<template #header>
								<span>Name</span>
							</template>
							<template #default="{ row }">
								<span>{{ row.name }}</span>
							</template>
							<template #footer>
								<span class="font-semibold"
									>Total: {{ mockApiData.length }} records</span
								>
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
				</DialogContent>
			</Dialog>
		</div>

		<!-- Switch Controls -->
		<div class="mb-6 p-4 bg-gray-50 rounded-lg">
			<h3 class="text-lg font-semibold mb-3">Table Mode</h3>
			<div class="flex items-center relative gap-2">
				<div
					class="transition-all duration-300 ease-out hover:translate-x-20 hover:translate-y-10 hover:rotate-12 hover:scale-150 pl-10 pt-10 pb-10"
				>
					<Switch v-model="showPaginationTable" />
				</div>
				<label class="font-medium select-none">
					{{ showPaginationTable ? 'Pagination Mode' : 'Infinite Scroll Mode' }}
				</label>
				<span class="text-xs text-gray-500 ml-2 animate-pulse">
					(Try to hover the switch! 😄)
				</span>
			</div>
		</div>

		<div class="mb-8">
			<h2 class="text-xl font-semibold mb-2">Role Access Settings</h2>
			<p class="mb-4 text-sm text-neutral-600">
				Buka kategori untuk memilih hak akses spesifik untuk role Editor.
			</p>
			<DataTable
				v-model:opened-detailed="openedDetailedRoles"
				:data="roleData"
				detailed
				detail-key="id"
				children-key="permissions"
				:show-numbering="true"
				:paginated="false"
				scroll-y="''"
			>
				<DataTableColumn field="permission" :order="1">
					<template #header>Module</template>
					<template #default="{ row }">
						{{ row.permission }}
					</template>
				</DataTableColumn>

				<DataTableColumn field="view" :order="2">
					<template #header>
						<div class="flex flex-col items-center justify-center gap-1 py-3 mx-auto w-2">
							<span>View</span>
							<Checkbox
								:model-value="isAllPermissionsGranted('view')"
								:indeterminate="isPermissionIndeterminate('view')"
								:value="true"
								@update:model-value="value => toggleAllPermissions('view', value)"
							/>
						</div>
					</template>
					<template #default="{ row }">
						<div class="flex justify-center">
							<Checkbox
								v-if="!row.permissions"
								:model-value="hasPermission(row.id, 'view')"
								:value="true"
								class="mx-auto"
								@update:model-value="togglePermission(row.id, 'view')"
							/>
						</div>
					</template>
				</DataTableColumn>

				<DataTableColumn field="create" :order="3">
					<template #header>
						<div class="flex flex-col items-center justify-center gap-1 py-3 mx-auto w-2">
							<span>Create</span>
							<Checkbox
								:model-value="isAllPermissionsGranted('create')"
								:indeterminate="isPermissionIndeterminate('create')"
								:value="true"
								@update:model-value="value => toggleAllPermissions('create', value)"
							/>
						</div>
					</template>
					<template #default="{ row }">
						
						<div class="flex justify-center">
							<Checkbox
								v-if="!row.permissions"
								:model-value="hasPermission(row.id, 'create')"
								:value="true"
								class="mx-auto"
								@update:model-value="togglePermission(row.id, 'create')"
							/>
						</div>
					</template>
				</DataTableColumn>

				<DataTableColumn field="update" :order="4">
					<template #header>
						<div class="flex flex-col items-center justify-center gap-1 py-3 mx-auto w-2">
							<span>Edit</span>
							<Checkbox
								:model-value="isAllPermissionsGranted('update')"
								:indeterminate="isPermissionIndeterminate('update')"
								:value="true"
								@update:model-value="value => toggleAllPermissions('update', value)"
							/>
						</div>
					</template>
					<template #default="{ row }">
						<div class="flex justify-center">
							<Checkbox
								v-if="!row.permissions"
								:model-value="hasPermission(row.id, 'update')"
								:value="true"
								@update:model-value="togglePermission(row.id, 'update')"
							/>
						</div>
					</template>
				</DataTableColumn>

				<DataTableColumn field="delete" :order="5">
					<template #header>
						<div class="flex flex-col items-center justify-center gap-1 py-3 mx-auto w-2">
							<span>Delete</span>
							<Checkbox
								:model-value="isAllPermissionsGranted('delete')"
								:indeterminate="isPermissionIndeterminate('delete')"
								:value="true"
								@update:model-value="value => toggleAllPermissions('delete', value)"
							/>
						</div>
					</template>
					<template #default="{ row }">
						
						<div class="flex justify-center">
							<Checkbox
								v-if="!row.permissions"
								:model-value="hasPermission(row.id, 'delete')"
								:value="true"
								@update:model-value="togglePermission(row.id, 'delete')"
							/>
						</div>
					</template>
				</DataTableColumn>
			</DataTable>
		</div>

		<!-- Infinite Scroll Table -->
		<div v-if="!showPaginationTable">
			<h2 class="text-xl font-semibold mb-4">Infinite Scroll Data Table</h2>
			<DataTable
				v-model:page="currentPage"
				v-model:per-page="perPage"
				:data="displayedData"
				:show-numbering="true"
				:loading="isLoading"
				infinite-scroll
				:total="mockApiData.length"
				:row-class="getRowClass"
				scroll-y="40vh"
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

		<!-- Pagination Table -->
		<div v-else>
			<h2 class="text-xl font-semibold mb-4">Pagination Data Table</h2>
			<DataTable
				v-model:page="paginationPage"
				v-model:per-page="paginationPerPage"
				:data="paginationData"
				:show-numbering="true"
				:loading="isPaginationLoading"
				:paginated="true"
				:total="mockApiData.length"
				:infinite-scroll="false"
				show-footer
			>
				<DataTableColumn field="name" :order="1">
					<template #header>
						<span>Name</span>
					</template>
					<template #default="{ row }">
						<span>{{ row.name }}</span>
					</template>
					<template #footer>
						<span class="font-semibold"
							>Total Employees: {{ mockApiData.length }}</span
						>
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
				<template #empty>
					<TableEmpty>
						<div class="flex flex-col gap-4 justify-center items-center">
							<img
								src="https://portaldos-next.dev.civitas.id/__siakad/empty-data.IiePSu6Z.svg"
								alt="Empty data image"
								width="120"
							/>
							<p
								class="text-sm text-neutral-700 text-center whitespace-pre-line"
							>
								No data available. Please try again later.
							</p>
						</div>
					</TableEmpty>
				</template>
			</DataTable>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DataTable from '../../lib/components/datatablev2/DataTable.vue'
import DataTableColumn from '../../lib/components/datatablev2/DataTableColumn.vue'
import Switch from '../../lib/components/switch/Switch.vue'
import TableEmpty from '@/components/table/TableEmpty.vue'
import Checkbox from '../../lib/components/checkbox/Checkbox.vue'

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

// State for infinite scroll
const displayedData = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const perPage = ref(10)

// State for pagination
const paginationPage = ref(1)
const paginationPerPage = ref(15)
const isPaginationLoading = ref(false)
const paginationData = ref([])

// Switch state
const showPaginationTable = ref(true) // false = infinite scroll, true = pagination

const openedDetailedRoles = ref(['user-management'])
const selectedPermissions = ref({
	users: ['view', 'create'],
	roles: ['view'],
	articles: ['view', 'create', 'update'],
	media: ['view', 'create'],
	reports: ['view'],
})
const roleData = [
	{
		id: 'user-management',
		permission: 'User Management',
		permissions: [
			{
				id: 'users',
				permission: 'Users',
			},
			{
				id: 'roles',
				permission: 'Roles',
			},
		],
	},
	{
		id: 'content-management',
		permission: 'Content Management',
		permissions: [
			{
				id: 'articles',
				permission: 'Articles',
			},
			{
				id: 'media',
				permission: 'Media',
			},
		],
	},
	{
		id: 'reporting',
		permission: 'Reporting',
		permissions: [
			{
				id: 'reports',
				permission: 'Reports',
			},
		],
	},
]

const permissionIds = roleData.flatMap(group =>
	group.permissions.map(permission => permission.id)
)

function hasPermission(permissionId, action) {
	return selectedPermissions.value[permissionId]?.includes(action) || false
}

function isAllPermissionsGranted(action) {
	return permissionIds.every(permissionId => hasPermission(permissionId, action))
}

function isPermissionIndeterminate(action) {
	const grantedCount = permissionIds.filter(permissionId => hasPermission(permissionId, action)).length
	return grantedCount > 0 && grantedCount < permissionIds.length
}

function toggleAllPermissions(action, value) {
	const selected = { ...selectedPermissions.value }
	for (const permissionId of permissionIds) {
		const permissions = selected[permissionId] || []
		selected[permissionId] = value
			? [...new Set([...permissions, action])]
			: permissions.filter(permission => permission !== action)
	}
	selectedPermissions.value = selected
}

function togglePermission(permissionId, action) {
	const permissions = selectedPermissions.value[permissionId] || []
	if (permissions.includes(action)) {
		selectedPermissions.value = {
			...selectedPermissions.value,
			[permissionId]: permissions.filter(permission => permission !== action),
		}
		return
	}
	selectedPermissions.value = {
		...selectedPermissions.value,
		[permissionId]: [...permissions, action],
	}
}

// Computed for infinite scroll
const hasMoreData = computed(() => {
	return displayedData.value.length < mockApiData.length
})

// Computed for pagination - removed unused computed properties

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

// Modal data loading function
const loadModalData = async (page = modalPage.value) => {
	isModalLoading.value = true

	// Simulate API delay
	await new Promise(resolve => setTimeout(resolve, 600))

	// Load page data
	const startIndex = (page - 1) * modalPerPage.value
	const endIndex = startIndex + modalPerPage.value
	const pageData = mockApiData.slice(startIndex, endIndex)

	modalData.value = pageData
	isModalLoading.value = false
}

// Pagination loading function
const loadPaginationData = async (page = paginationPage.value) => {
	isPaginationLoading.value = true

	// Simulate API delay
	await new Promise(resolve => setTimeout(resolve, 800))

	// Load page data
	const startIndex = (page - 1) * paginationPerPage.value
	const endIndex = startIndex + paginationPerPage.value
	const pageData = mockApiData.slice(startIndex, endIndex)

	paginationData.value = pageData
	isPaginationLoading.value = false
}

// Handle pagination page change - function removed as it's handled by watcher

// Watch for page changes (infinite scroll will increment the page)
watch(currentPage, (newPage, oldPage) => {
	console.log('Page changed from', oldPage, 'to', newPage)
	if (newPage > oldPage && displayedData.value.length > 0) {
		loadMoreData()
	}
})

// Watch for pagination page changes
watch(paginationPage, newPage => {
	console.log('Pagination page changed to:', newPage)
	loadPaginationData(newPage)
})

// Watch for pagination per page changes
watch(paginationPerPage, () => {
	paginationPage.value = 1 // Reset to first page
	loadPaginationData(1)
})

// Watch for mode changes to ensure pagination data is loaded
watch(showPaginationTable, isPagination => {
	if (isPagination) {
		loadPaginationData(paginationPage.value)
	}
})

// Watch for modal page changes
watch(modalPage, newPage => {
	loadModalData(newPage)
})

// Watch for modal per page changes
watch(modalPerPage, () => {
	modalPage.value = 1
	loadModalData(1)
})

// Initialize
onMounted(() => {
	loadInitialData()
	loadPaginationData() // Load initial pagination data
	loadModalData() // Load initial modal data
})

const getRowClass = row => {
	console.log('Row data for class:', row)
	// You can add your logic here to return different classes based on row data
	if (row.department === 'Engineering') {
		return '!bg-primary-subtle'
	}
	if (row.department === 'Marketing') {
		return '!bg-success-subtle'
	}
	if (row.department === 'Sales') {
		return '!bg-warning-subtle'
	}
	return ''
}
</script>
