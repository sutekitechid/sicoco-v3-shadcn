<template>
	<DataTable
		id="academic-course-table"
		v-model:page="page"
		v-model:per-page="perPage"
		data-cy="academic-course-table"
		:data="isLoadingCourseList ? [] : pagedCourseList"
		paginated
		:loading="isLoadingCourseList"
		:total="total"
	>
		<DataTableColumn field="kode" sortable>
			<template #header>
				<span class="whitespace-nowrap">
					{{ 'course_code' }}
				</span>
			</template>
			<template #default="{ row }">
				{{ row.kode }}
			</template>
		</DataTableColumn>
		<DataTableColumn field="sks">
			<template #header>SKS</template>
			<template #default="{ row }">
				{{ row.sks }}
			</template>
		</DataTableColumn>
		<DataTableColumn field="nama_prodi" sortable>
			<template #header>Prodi</template>
			<template #default="{ row }">
				{{ row.prodi.jenjang }} {{ row.prodi.nama }}
			</template>
		</DataTableColumn>
		<DataTableColumn field="kelompok">
			<template #header>Kelompok</template>
			<template #default="{ row }">
				{{ row.label_kelompok }}
			</template>
		</DataTableColumn>
		<DataTableColumn field="semester" sortable>
			<template #header>Semester</template>
			<template #default="{ row }">
				{{ row.semester }}
			</template>
		</DataTableColumn>
		<DataTableColumn field="mk_lab">
			<template #header>
				<span class="whitespace-nowrap"> Lab </span>
			</template>
			<template #default="{ row }">
				{{ row.label_mk_lab }}
			</template>
		</DataTableColumn>
	</DataTable>
</template>

<script lang="ts">
import { DataTable, DataTableColumn } from '@/components/data-table'

import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'

export default {
	name: 'AcademicCourseTable',
	components: {
		DataTable,
		DataTableColumn,
	},
	setup() {
		const route = useRoute()

		// MOCK DATA
		const courseList = ref([
			{
				id: '1',
				kode: 'AK101',
				nama: 'Pengantar Akuntansi',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 3,
				semester: 1,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '2',
				kode: 'AK102',
				nama: 'Akuntansi Keuangan Dasar',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 3,
				semester: 2,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '3',
				kode: 'AK103',
				nama: 'Akuntansi Biaya',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 3,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '4',
				kode: 'AK104',
				nama: 'Akuntansi Manajemen',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 4,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '5',
				kode: 'AK105',
				nama: 'Perpajakan',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 5,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '6',
				kode: 'AK106',
				nama: 'Audit',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 3,
				semester: 6,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '7',
				kode: 'AK107',
				nama: 'Sistem Informasi Akuntansi',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 7,
				mk_lab: 'Y',
				label_mk_lab: 'Ya',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '8',
				kode: 'AK108',
				nama: 'Akuntansi Sektor Publik',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 8,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '9',
				kode: 'AK109',
				nama: 'Etika Profesi Akuntansi',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 5,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '10',
				kode: 'AK110',
				nama: 'Metodologi Penelitian Akuntansi',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 3,
				semester: 6,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			// Tambahan mock data 20 item lagi
			{
				id: '11',
				kode: 'AK111',
				nama: 'Akuntansi Lanjutan 1',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 3,
				semester: 7,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '12',
				kode: 'AK112',
				nama: 'Akuntansi Lanjutan 2',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 3,
				semester: 8,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '13',
				kode: 'AK113',
				nama: 'Akuntansi Pemerintahan',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 5,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '14',
				kode: 'AK114',
				nama: 'Akuntansi Internasional',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 6,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '15',
				kode: 'AK115',
				nama: 'Akuntansi Forensik',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 7,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '16',
				kode: 'AK116',
				nama: 'Akuntansi Pajak',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 8,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '17',
				kode: 'AK117',
				nama: 'Akuntansi Syariah',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 5,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '18',
				kode: 'AK118',
				nama: 'Akuntansi Keuangan Menengah',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 3,
				semester: 6,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '19',
				kode: 'AK119',
				nama: 'Akuntansi Manajemen Lanjutan',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 3,
				semester: 7,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '20',
				kode: 'AK120',
				nama: 'Akuntansi Biaya Lanjutan',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 3,
				semester: 8,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '21',
				kode: 'AK121',
				nama: 'Akuntansi Perbankan',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 5,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '22',
				kode: 'AK122',
				nama: 'Akuntansi Investasi',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 6,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '23',
				kode: 'AK123',
				nama: 'Akuntansi Perusahaan',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 7,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '24',
				kode: 'AK124',
				nama: 'Akuntansi Perusahaan Lanjutan',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 8,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '25',
				kode: 'AK125',
				nama: 'Akuntansi Anggaran',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 5,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '26',
				kode: 'AK126',
				nama: 'Akuntansi Pemeriksaan',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 6,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '27',
				kode: 'AK127',
				nama: 'Akuntansi Konsolidasi',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 7,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '28',
				kode: 'AK128',
				nama: 'Akuntansi Perpajakan',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 8,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'A',
				label_kelompok: 'Wajib',
			},
			{
				id: '29',
				kode: 'AK129',
				nama: 'Akuntansi Manajemen Biaya',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 5,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
			{
				id: '30',
				kode: 'AK130',
				nama: 'Akuntansi Manajemen Lanjutan 2',
				prodi: { id: '62201', nama: 'Akuntansi', jenjang: 'S1' },
				sks: 2,
				semester: 6,
				mk_lab: 'T',
				label_mk_lab: 'Tidak',
				status: 'A',
				label_status: 'Ya',
				kelompok: 'B',
				label_kelompok: 'Pilihan',
			},
		])

		const page = ref(1)
		const perPage = ref(10)
		const total = computed(() => courseList.value.length)
		const isLoadingCourseList = ref(false)

		// Data yang akan ditampilkan sesuai page & perPage, dengan fake loading
		const pagedCourseList = computed(() => {
			isLoadingCourseList.value = true
			// fake loading delay 500ms

			setTimeout(() => {
				isLoadingCourseList.value = false
			}, 500)
			if (!page.value) return courseList.value.slice(0, 10)
			const start = (page.value - 1) * perPage.value
			const end = start + perPage.value
			return courseList.value.slice(start, end)
		})

		const showingFrom = computed(() => {
			return total.value === 0 ? 0 : (page.value - 1) * perPage.value + 1
		})
		const showingTo = computed(() => {
			const to = page.value * perPage.value
			return to > total.value ? total.value : to
		})

		return {
			courseList,
			page,
			perPage,
			total,
			isLoadingCourseList,
			pagedCourseList,
			showingFrom,
			showingTo,
		}
	},
}
</script>
