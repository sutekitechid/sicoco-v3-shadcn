<template>
	<div class="overflow-x-auto">
		<table
			class="table-auto border-collapse border border-gray-300 w-full text-sm"
		>
			<thead class="bg-gray-100">
				<tr>
					<th class="border border-gray-300 px-4 py-2 text-left" rowspan="2">
						No
					</th>
					<th class="border border-gray-300 px-4 py-2 text-left" rowspan="2">
						NIM
					</th>
					<th class="border border-gray-300 px-4 py-2 text-left" rowspan="2">
						Nama
					</th>
					<th class="border border-gray-300 px-4 py-2 text-center" colspan="3">
						Nilai
					</th>
					<th class="border border-gray-300 px-4 py-2 text-left" rowspan="2">
						Nilai Akhir
					</th>
					<th class="border border-gray-300 px-4 py-2 text-left" rowspan="2">
						Bobot
					</th>
					<th class="border border-gray-300 px-4 py-2 text-left" rowspan="2">
						Simbol
					</th>
				</tr>
				<tr>
					<th class="border border-gray-300 px-4 py-2 text-left">
						Tugas (30%)
					</th>
					<th class="border border-gray-300 px-4 py-2 text-left">UTS (30%)</th>
					<th class="border border-gray-300 px-4 py-2 text-left">UAS (40%)</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(row, index) in tableData"
					:key="index"
					class="hover:bg-gray-50"
				>
					<td class="border border-gray-300 px-4 py-2 text-center">
						{{ index + 1 }}
					</td>
					<td class="border border-gray-300 px-4 py-2">{{ row.nim }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ row.nama }}</td>
					<td class="border border-gray-300 px-4 py-2">
						<input
							type="number"
							v-model="row.tugas"
							class="border border-gray-300 rounded px-2 py-1 w-full"
						/>
					</td>
					<td class="border border-gray-300 px-4 py-2">
						<input
							type="number"
							v-model="row.uts"
							class="border border-gray-300 rounded px-2 py-1 w-full"
						/>
					</td>
					<td class="border border-gray-300 px-4 py-2">
						<input
							type="number"
							v-model="row.uas"
							class="border border-gray-300 rounded px-2 py-1 w-full"
						/>
					</td>
					<td class="border border-gray-300 px-4 py-2 text-center">
						{{ calculateNilai(row) }}
					</td>
					<td class="border border-gray-300 px-4 py-2 text-center">
						{{ row.bobot }}
					</td>
					<td class="border border-gray-300 px-4 py-2 text-center">
						{{ row.simbol }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			tableData: [
				{
					nim: '39032010',
					nama: 'Sapto Adi Purnomo',
					tugas: 100,
					uts: 0,
					uas: 0,
					bobot: 4,
					simbol: 'A',
				},
				{
					nim: '39032010',
					nama: 'Wade Warren',
					tugas: 85,
					uts: 0,
					uas: 0,
					bobot: 3,
					simbol: 'B',
				},
				{
					nim: '39032010',
					nama: 'Ralph Edwards',
					tugas: 0,
					uts: 0,
					uas: 0,
					bobot: 3.75,
					simbol: 'A-',
				},
				{
					nim: '39032010',
					nama: 'Jenny Wilson',
					tugas: 0,
					uts: 0,
					uas: 0,
					bobot: 0,
					simbol: 'E',
				},
			],
		}
	},
	methods: {
		calculateNilai(row) {
			const tugas = row.tugas * 0.3
			const uts = row.uts * 0.3
			const uas = row.uas * 0.4
			return tugas + uts + uas
		},
	},
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
