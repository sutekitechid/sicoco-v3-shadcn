interface ApiUnit {
	id: string
	name: string
	quality_assurance: string
	level: number
	kind: string
	major_id: string
	parent_id: string
	has_access: boolean
	can_delete: boolean
	can_edit: boolean
	can_remove: boolean
	items?: ApiUnit[]
}

function unit(
	id: string,
	name: string,
	level: number,
	parent_id = '',
	quality_assurance = '',
	kind = 'central_auditee',
	major_id = '',
	can_delete = false,
	items?: ApiUnit[],
): ApiUnit {
	return {
		id, name, quality_assurance, level, kind, major_id, parent_id,
		has_access: true, can_delete, can_edit: true, can_remove: true,
		...(items ? { items } : {}),
	}
}

const a = '01a176ff-eb5a-75fd-964e-0ec366efffa5'
const b = '01a109c4-84f2-725f-8c0b-3ee8aa015933'
const e = '01a1813e-973f-7b4a-886a-3d7cf18b4d64'
const z = '01a19ba4-235e-7551-8722-b8451991ded0'
const added = '01a1cec1-e22a-7759-a0e3-795606e45d96'
const university = '01a1ceac-bcd7-7e74-9809-3bb9433a2475'
const briyan = '01a1ab0a-f5cf-7e44-b06d-6f3e6a4b90a6'
const prodiA = '01a17700-98f8-7612-95f7-ee92ed5ef615'
const prodiB = '01a17701-8315-7f1d-acf9-a80f2af25ac0'
const prodiC = '01a17702-2986-754f-b417-e2037a009a55'
const prodiCC = '01a17b99-149e-7f3a-8389-0fc2b4c0175c'
const ekonomi = '01a1cead-81cc-7552-8bd5-687efaa0f5ea'
const seni = '01a1cead-c0b3-776b-ae86-067e0f0b6f88'
const teknik = '01a1cead-2a5b-780a-af8f-7e41623a0ce6'

export const dropdownUnitsResponse = {
	data: [
		unit(a, 'Fakultas A', 1, '', 'LPM', 'central_auditee', '', false, [
			unit('01a1e319-b160-7c2c-be94-04d2e7b74c67', 'awaw', 2, a, '', 'central_auditee', '', true),
			unit('01a1e31a-d945-73b2-8ced-48f037c66825', 'dsa', 2, a, '', 'central_auditee', '', true),
			unit('01a1e31a-5199-78f0-ac5c-8db58255f094', 'dsadsadasdasd', 2, a, '', 'central_auditee', '', true),
			unit(prodiA, 'Prodi A', 2, a, 'GPM', 'major', '55201', false, [
				unit('01a17701-4228-75ba-9311-4c27a455a479', 'Konsentrasi AB', 3, prodiA, 'UPM', 'support_unit'),
				unit('01a17702-d7cb-72d7-a678-ef5196cb2201', 'Konsentrasi B', 3, prodiA, 'UPM', 'support_unit'),
				unit('01a17703-08f4-7927-8c02-a088e5123b0f', 'Konsentrasi C', 3, prodiA, 'UPM', 'support_unit'),
				unit('01a17740-f183-739b-aecc-0cd823dfd761', 'Konsentrasi D', 3, prodiA, 'UPM', 'support_unit'),
			]),
			unit(prodiB, 'Prodi B', 2, a, 'GPM', 'major', '55202', false, [
				unit('01a17701-cf50-76e3-8755-5cee406f451f', 'Konsentrasi AA', 3, prodiB, 'UPM', 'support_unit'),
				unit('01a17703-8583-7464-b31a-f7831694406d', 'Konsentrasi BB', 3, prodiB, 'UPM', 'support_unit'),
				unit('01a17703-c25f-74b1-8f58-9f7c3ba85193', 'Konsentrasi CC', 3, prodiB, 'UPM', 'support_unit'),
				unit('01a186a3-84fc-7940-ac53-3a9ae4ff91ee', 'prodi QA', 3, prodiB),
			]),
			unit(prodiC, 'Prodi C', 2, a, 'GPM', 'major', '55203', false, [
				unit('01a17702-7cc5-7179-b229-b88575e368ca', 'Konsentrasi AAA', 3, prodiC, 'UPM', 'support_unit'),
			]),
			unit('01a17741-669d-7d33-ab53-9d716ce2f17d', 'Prodi D', 2, a, 'GPM', 'major', '55204'),
			unit('01a1e30f-fad2-717d-90b1-4fa1ae5de399', 'teeeees', 2, a, '', 'central_auditee', '', true),
			unit('01a1e319-4d09-73c9-ae8a-d94e4f94a9c0', 'tes hhhhhhhh', 2, a, '', 'central_auditee', '', true),
		]),
		unit(b, 'Fakultas B', 1, '', 'LPM', 'central_auditee', '', false, [
			unit('01a1e315-771d-7d5f-95f8-c389c290c2bc', 'aku lelah', 2, b, '', 'central_auditee', '', true),
			unit('01a13307-e0d1-7094-9f90-95524e6cfd31', 'Prodi AA', 2, b, 'GPM', 'major', '66201'),
			unit('01a17b98-cf44-7b1d-bf40-181fc42f76b7', 'Prodi BB', 2, b, 'GPM', 'major', '66202'),
			unit(prodiCC, 'Prodi CC', 2, b, 'GPM', 'major', '66203', false, [
				unit('01a17b99-8061-7895-8bb8-add24de3da48', 'Konsentrasi X', 3, prodiCC, 'UPM', 'support_unit'),
			]),
		]),
		unit('01a17c9b-9a02-7c2f-b1bc-6220922e77b0', 'Fakultas C', 1, '', 'LPM'),
		unit('01a17cb8-ad64-736d-827d-55c06e542b78', 'Fakultas D', 1, '', 'LPM'),
		unit(e, 'Fakultas E', 1, '', 'LPM', 'central_auditee', '', false, [
			unit('01a1e31d-5d29-7daa-8ad5-49de960004e9', 'bisa plis', 2, e, '', 'central_auditee', '', true),
			unit('01a1e31c-3458-7d87-ab38-8abdb4f46d96', 'bismillah', 2, e, '', 'central_auditee', '', true),
			unit('01a1e31f-262f-7c54-a301-16a6509f0470', 'ini bisa', 2, e, '', 'central_auditee', '', true),
			unit('01a1e31b-ae2b-7ee2-91ed-075cb169d276', 'semoga berhasil', 2, e, '', 'central_auditee', '', true),
			unit('01a1e31c-eed1-7dc0-b597-7fde1bd9107b', 'ssasadfasdasdasd', 2, e, '', 'central_auditee', '', true),
			unit('01a1e324-aad6-726e-8f4a-b20226614f7c', 'tes allahuakabar', 2, e, '', 'central_auditee', '', true),
		]),
		unit(z, 'Fakultas Z', 1, '', 'LPM', 'central_auditee', '', false, [
			unit('01a1a036-6788-7089-8389-fd5a4dbb6dce', 'Prodi XX', 2, z, 'GPM', 'major', '55701'),
			unit('01a1a0b3-809c-7491-9966-2e8a447378fa', 'Prodi YY', 2, z, 'GPM', 'major', '55702'),
		]),
		unit(added, 'ini contoh tambah unit', 1, '', '', 'central_auditee', '', false, [
			unit('01a1cec2-6f9f-77b3-b5d8-b3c6ca7d2a84', 'ini subunit', 2, added),
		]),
		unit(university, 'Universitas Teknologi Nusantara', 1, '', 'LPM', 'central_auditee', '', false, [
			unit(ekonomi, 'Fakultas Ekonomi', 2, university, 'GPM', 'central_auditee', '', false, [
				unit('01a1ceaf-f7a5-7651-8585-61bd84c3445e', 'Akuntansi', 3, ekonomi, 'UPM', 'major', '22002'),
				unit('01a1ceb1-b33b-7aff-8192-0a5acdd7d6e4', 'Badan Akademik', 3, ekonomi, '', 'support_unit'),
				unit('01a1e317-eecf-7623-acd1-330fc7f08aca', 'lelah', 3, ekonomi, '', 'central_auditee', '', true),
				unit('01a1ceae-7d8c-777c-812b-81443eec1f91', 'Manajemen', 3, ekonomi, 'UPM', 'major', '22001'),
			]),
			unit(seni, 'Fakultas Seni Budaya', 2, university, 'GPM', 'central_auditee', '', false, [
				unit('01a1ceb1-ebcc-7300-a973-1d6dc5455a30', 'Badan Keuangan', 3, seni, '', 'support_unit'),
				unit('01a1ceb0-4a13-71f2-9e07-2b1a30e34b8d', 'Bahasa Indonesia', 3, seni, 'UPM', 'major', '11001'),
				unit('01a1ceb0-9570-7ef5-b817-a4e9f6c0d410', 'Bahasa Inggris', 3, seni, 'UPM', 'major', '11002'),
			]),
			unit(teknik, 'Fakultas Teknik', 2, university, 'GPM', 'central_auditee', '', false, [
				unit('01a1ceb0-c801-75a5-8a7f-cb5603c9defb', 'Tekin Industri', 3, teknik, 'UPM', 'major', '33001'),
				unit('01a1ceb1-5deb-7423-93b0-b67820845882', 'Teknik Lingkungan', 3, teknik, 'UPM', 'major', '33003'),
				unit('01a1ceb1-0c56-7b3c-919e-474dfbc5e84d', 'Teknik Mesin', 3, teknik, 'UPM', 'major', '33002'),
			]),
			unit('01a1e30e-7929-7cec-92f6-e8311594ee97', 'tes', 2, university, '', 'central_auditee', '', true),
		]),
		unit(briyan, 'Briyan Ganteng', 2, '01a18a18-5f3d-7e30-bcad-558ed9f2dc68', '', 'major', '55209', false, [
			unit('01a1e2fa-0a51-7d9d-9b63-6c0809fa6367', 'cobain unit', 3, briyan, '', 'central_auditee', '', true),
			unit('01a1cf2a-20f1-7790-a3ea-8fcd7e7c384d', 'ini bu2', 3, briyan),
			unit('01a1e399-fa47-7f97-adea-ac34b194941b', 'tambh subunit', 3, briyan, '', 'central_auditee', '', true),
			unit('01a1e311-c887-7c20-8843-34cb5a53ea32', 'tesss', 3, briyan, '', 'central_auditee', '', true),
		]),
	],
}
