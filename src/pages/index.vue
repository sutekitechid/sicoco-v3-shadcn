<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import HelloWorld from '../components/HelloWorld.vue'
import Button from '@/components/button/Button.vue'
import Badge from '@/components/badge/Badge.vue'
import Skeleton from '@/components/skeleton/Skeleton.vue'
import Pagination from '@/components/pagination/Pagination.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownItem from '@/components/dropdown/DropdownItem.vue'
import Switch from '@/components/switch/Switch.vue'
import Input from '@/components/input/Input.vue'
import Checkbox from '@/components/checkbox/Checkbox.vue'
import CheckboxGroup from '@/components/checkbox/CheckboxGroup.vue'
import { Breadcrumb, BreadcrumbItem } from '@/components/breadcrumb'
import { FormInput } from '@/components/form-input'
import { Toaster, useToast } from '@/components/toast'
import { RadioGroupItem, RadioGroup } from '@/components/radio'
import Upload from '@/components/upload/Upload.vue'
import { Tooltip, TooltipContent } from '../../lib/components/tooltip'
import { Dialog, DialogContent } from '@/components/dialog'
import DatePicker from '@/components/date-picker/DatePicker.vue'
import {
	DateFormatter,
	type DateValue,
	getLocalTimeZone,
	CalendarDate,
	Time,
	CalendarDateTime,
	today,
} from '@internationalized/date'
import { ImportantDate } from '@/utils/date-picker-types'
import { Calendar, CalendarHeading } from '@/components/calendar'
import { RangeCalendar } from '@/components/range-calendar'
import type { DateRange } from 'radix-vue'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/accordion'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/card/index'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs'
import Textarea from '@/components/text-area/Textarea.vue'
import Sidemenu from '@/components/sidemenu/Sidemenu.vue'
import {
	NavigationMenu,
	NavigationMenuItem,
} from '../../lib/components/navigation-menu'
import { Alert, AlertDescription, AlertTitle } from '@/components/alert'
import Loading from '@/components/loading/Loading.vue'
import DataTable from '../components/data-table/DataTable.vue'
import SDataTable from '@/components/data-table/DataTable.vue'
import SDataTableColumn from '@/components/data-table/DataTableColumn.vue'
import TimePicker from '@/components/time-picker/TimePicker.vue'
import SRichTextEditor from '@/components/rich-editor/RichTextEditor.vue'
import DataTableInfiniteScroll from '../components/DataTableInfiniteScroll.vue'
import Stepper from '../components/stepper/Stepper.vue'

const page = ref(1)
const perPage = ref(10)

const defaultValue = 'item-1'

const decimalValue = ref(0)

watch(decimalValue, value => {
	console.log('decimalValue: ', value)
})

const accordionItems = [
	{
		value: 'item-1',
		title: 'Is it accessible?',
		content: 'Yes. It adheres to the WAI-ARIA design pattern.',
	},
	{
		value: 'item-2',
		title: 'Is it unstyled?',
		content:
			"Yes. It's unstyled by default, giving you freedom over the look and feel.",
	},
	{
		value: 'item-3',
		title: 'Can it be animated?',
		content: 'Yes! You can use the transition prop to configure the animation.',
	},
]
const optionDropdown = ref([
	{
		label: 'Search',
		value: 'option1',
		icons: 'si-search',
	},
	{
		label: 'Save',
		value: 'option2',
		icons: 'si-save',
	},
	{
		label: 'Router',
		value: 'option3',
		icons: 'si-router',
	},
	{
		label: 'Send',
		value: 'option4',
		icons: 'si-send',
	},
	{
		label: 'Settings',
		value: 'option5',
		icons: 'si-settings',
	},
	{
		label: 'Share',
		value: 'option6',
		icons: 'si-share',
	},
	{
		label: 'Shield',
		value: 'option7',
		icons: 'si-shield',
	},
	{
		label: 'Shopping Cart',
		value: 'option8',
		icons: 'si-shopping-cart',
	},
])

const modelDropdown = ref()
const modelDropdownTrigger = ref('')
const modelDropdownMultiple = ref([
	{
		label: 'Save',
		value: 'option2',
		icons: 'si-save',
	},
	{
		label: 'Router',
		value: 'option3',
		icons: 'si-router',
	},
])

function onSearch(keyword: string) {
	console.log('keyword: ', keyword)
}

const switchModel = ref([
	{
		model: true,
		disabled: false,
		label: 'Primary',
		variant: 'primary' as const,
	},
	{
		model: true,
		disabled: false,
		label: 'Success',
		variant: 'success' as const,
	},
	{
		model: true,
		disabled: false,
		label: 'Warning',
		variant: 'warning' as const,
	},
	{
		model: true,
		disabled: false,
		label: 'Danger',
		variant: 'danger' as const,
	},
	{
		model: true,
		disabled: false,
		label: 'Secondary',
		variant: 'secondary' as const,
	},
	{
		model: true,
		disabled: false,
		label: 'Grey / Gray',
		variant: 'grey' as const,
	},
])
const switchDisable = ref(false)

const checkboxOptions = [
	{ label: 'Option 1', value: 'option1' },
	{ label: 'Option 2', value: 'option2' },
	{ label: 'Option 3', value: 'option3' },
]
const selectedOptions = ref<string[]>([])
const customCheckbox = ref(true)
const checkboxmaul = ref(true)

function onSelect(payload) {
	console.log('payload: ', payload)
}

function onClickButton() {
	console.log('Button clicked!')
}
watch(
	selectedOptions,
	value => {
		console.log(value)
	},
	{ deep: true }
)

const checkboxRef = ref<HTMLInputElement | null>(null)

const selectedRadio = ref<string | null>('option2')
onMounted(() => {
	console.log(checkboxRef.value)
})

const { toast } = useToast()

watch(
	selectedRadio,
	value => {
		console.log(value)
	},
	{ deep: true }
)

const selectedFiles = ref<File | null>(null)
const selectedFiles2 = ref<File | null>(null)

watch(
	selectedFiles,
	value => {
		console.log(value)
	},
	{ deep: true }
)
const dialogOpened = ref(false)

const selectedDate = ref(new CalendarDate(2024, 12, 20)) as Ref<DateValue>
const selectedDateNullAtFirst = ref(null)
const selectedStartDate = ref(new CalendarDate(2024, 1, 20)) as Ref<DateValue>
const selectedEndDate = ref(
	new CalendarDate(2024, 1, 20).add({ days: 5 })
) as Ref<DateValue>
// const selectedStartDate = ref(null)
// const selectedEndDate = ref(null)
const start = today(getLocalTimeZone())
const end = start.add({ days: 7 })

const selectedRangeDate = ref({
	start,
	end,
}) as Ref<DateRange>

const BEResponse = [
	{
		tanggal: '2023-12-31',
		tanggalMulai: '2023-12-31',
		tanggalSelesai: '2024-01-31',
		nama: 'Heregistrasi Semester Genap',
		jenisKegiatan: {
			idJenisKegiatan: '12',
			nama: 'Heregistrasi Semester Genap',
			warna: 'FFCC00',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-01-02',
		tanggalMulai: '2024-01-02',
		tanggalSelesai: '2024-01-31',
		nama: 'Heregistrasi Semester Genap',
		jenisKegiatan: {
			idJenisKegiatan: '12',
			nama: 'Heregistrasi Semester Genap',
			warna: 'FFCC00',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-06-01',
		tanggalMulai: '2024-06-01',
		tanggalSelesai: '2024-06-02',
		nama: 'Jalan jalan',
		jenisKegiatan: {
			idJenisKegiatan: '11',
			nama: 'Outing',
			warna: '00FFCC',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-06-10',
		tanggalMulai: '0000-00-00',
		tanggalSelesai: '0000-00-00',
		nama: 'Libur Idul Adha',
		jenisKegiatan: {
			idJenisKegiatan: '04',
			nama: 'Libur',
			warna: 'FF0000',
		},
		jenisLibur: 'T',
	},
	{
		tanggal: '2024-08-30',
		tanggalMulai: '2024-08-30',
		tanggalSelesai: '2024-08-30',
		nama: 'asdasd',
		jenisKegiatan: {
			idJenisKegiatan: '00',
			nama: '',
			warna: '',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '12',
			nama: 'Heregistrasi Semester Genap',
			warna: 'FFCC00',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '11',
			nama: 'Outing',
			warna: '00FFCC',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '09',
			nama: 'Bimbingan PA',
			warna: '9999CC',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '06',
			nama: 'PK2MB',
			warna: 'CC0099',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '04',
			nama: 'Libur',
			warna: 'FF0000',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '02',
			nama: '',
			warna: '',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '01',
			nama: '',
			warna: '',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '99',
			nama: 'UAS',
			warna: '0000CC',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '10',
			nama: 'Ujian Lab. Berbasis Komputer',
			warna: 'CC66FF',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '08',
			nama: 'Kegiatan KRS',
			warna: 'CC9999',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '05',
			nama: 'Wisuda Mahasiswa',
			warna: '660066',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '03',
			nama: '',
			warna: '',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-09-25',
		tanggalMulai: '2024-09-25',
		tanggalSelesai: '2024-09-25',
		nama: 'a',
		jenisKegiatan: {
			idJenisKegiatan: '00',
			nama: '',
			warna: '',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-10-17',
		tanggalMulai: '2024-10-17',
		tanggalSelesai: '2024-10-17',
		nama: 'Lorem Ipsum',
		jenisKegiatan: {
			idJenisKegiatan: '13',
			nama: 'Perkuliahan',
			warna: '000099',
		},
		jenisLibur: null,
	},
	{
		tanggal: '2024-10-21',
		tanggalMulai: '2024-10-21',
		tanggalSelesai: '2024-10-25',
		nama: 'OUTING MAHASISWA',
		jenisKegiatan: {
			idJenisKegiatan: '11',
			nama: 'Outing',
			warna: '00FFCC',
		},
		jenisLibur: null,
	},
	{
		tanggal: '0000-00-00',
		tanggalMulai: '2024-12-25',
		tanggalSelesai: '2025-01-01',
		nama: 'Libur Natal &amp; Tahun Baru',
		jenisKegiatan: {
			idJenisKegiatan: '04',
			nama: 'Libur',
			warna: 'FF0000',
		},
		jenisLibur: 'R',
	},
	{
		tanggal: '0000-00-00',
		tanggalMulai: '2024-12-25',
		tanggalSelesai: '2024-10-31',
		nama: 'HARI NATAL',
		jenisKegiatan: {
			idJenisKegiatan: '04',
			nama: 'Libur',
			warna: 'FF0000',
		},
		jenisLibur: 'R',
	},
	{
		tanggal: '0000-00-00',
		tanggalMulai: '2024-12-25',
		tanggalSelesai: '2024-10-27',
		nama: 'Natal',
		jenisKegiatan: {
			idJenisKegiatan: '04',
			nama: 'Libur',
			warna: 'FF0000',
		},
		jenisLibur: 'R',
	},
	{
		tanggal: '0000-00-00',
		tanggalMulai: '2024-12-25',
		tanggalSelesai: '2024-12-27',
		nama: 'HARI NATAL',
		jenisKegiatan: {
			idJenisKegiatan: '04',
			nama: 'Libur',
			warna: 'FF0000',
		},
		jenisLibur: 'R',
	},
]

function transformToImportantDates(data: any): ImportantDate[] {
	return data
		.filter(
			(event: any) =>
				event.tanggal !== '0000-00-00' || event.tanggalMulai !== '0000-00-00'
		)
		.map((event: any) => {
			const rawDate =
				event.tanggal !== '0000-00-00' ? event.tanggal : event.tanggalMulai
			const [year, month, day] = rawDate.split('-').map(Number)

			return {
				date: new CalendarDate(year, month, day),
				color: event.jenisKegiatan.warna
					? `#${event.jenisKegiatan.warna}`
					: '#000000',
				tooltip: event.nama,
			}
		})
}

const extractBEResponse = transformToImportantDates(BEResponse)

const importantDates: ImportantDate[] = [
	{
		date: new CalendarDate(2024, 12, 25),
		color: '#c30000',
		tooltip: 'Christmas Day',
	},
	{
		date: new CalendarDate(2024, 12, 25),
		color: '#ffa800',
		tooltip: 'Christmas Day Dua',
	},
	{
		date: new CalendarDate(2024, 12, 1),
		color: '#2737c9',
		tooltip: "New Year's Day",
	},
	{
		date: new CalendarDate(2024, 12, 28),
		color: '#ffa800',
		tooltip: 'Thanksgiving',
	},
	{
		date: new CalendarDate(2024, 12, 4),
		color: '#2737c9',
		tooltip: 'Independence Day',
	},
	{
		date: new CalendarDate(2024, 12, 1),
		color: '#ffa800',
		tooltip: "April Fool's Day",
	},
]
const accordionModel = ref()
watch(accordionModel, value => {
	console.log(value)
})
type tasbConfigInterface = {
	defaultValue?: string
	variant: 'boxes' | 'default'
	triggers: Array<{ value: string; label: string; badgeCount?: string }>
	contents: Array<{ value: string; text: string }>
}

const tabsConfig = ref<tasbConfigInterface[]>([
	{
		defaultValue: 'account',
		variant: 'boxes',
		triggers: [
			{ value: 'account', label: 'Account', badgeCount: '1' },
			{ value: 'password', label: 'Password' },
			{ value: 'hahahaha', label: 'hahahaha' },
		],
		contents: [
			{ value: 'account', text: 'Make changes to your account here.' },
			{ value: 'password', text: 'Change your password here.' },
			{ value: 'hahahaha', text: 'hahahaha' },
		],
	},
	{
		defaultValue: 'profile',
		variant: undefined,
		triggers: [
			{ value: 'profile', label: 'Profile', badgeCount: '2' },
			{ value: 'settings', label: 'Settings' },
			{ value: 'hahahaha', label: 'hahahaha' },
		],
		contents: [
			{ value: 'profile', text: 'View and edit your profile here.' },
			{ value: 'settings', text: 'Manage your account settings here.' },
			{ value: 'hahahaha', text: 'hahahaha' },
		],
	},
])

const themes = ref([
	{
		label: 'Default',
		value: '',
	},
	{
		label: 'Purple',
		value: 'purple',
	},
])

const theme = ref(undefined)

const onChangeTheme = (value: string) => {
	// change html[data-theme] value
	document.documentElement.setAttribute('data-theme', value)
}

const mode = ref('')
watch(
	mode,
	value => {
		console.log('value: ', value)
		// change html[data-theme] value
		document.documentElement.setAttribute('data-mode', value)
	},
	{ immediate: true }
)

// textarea
const inputValue = ref('')
const inputDisabledValue = ref('')

// Sidemenu
const menuItems = [
	{ label: 'Biodata', to: '/biodata' },
	{ label: 'Aktivitas Mengajar', to: '/aktivitas-mengajar' },
	{ label: 'Riwayat Pendidikan', to: '/riwayat-pendidikan' },
	{ label: 'Penelitian/Publikasi', to: '/penelitian-publikasi' },
	{ label: 'Pengabdian Masy.', to: '/pengabdian-masy' },
	{ label: 'Kegiatan Organisasi', to: '/kegiatan-organisasi' },
	{ label: 'Riwayat Studi Lanjut', to: '/riwayat-studi-lanjut' },
	{ label: 'Pelatihan/Seminar', to: '/pelatihan-seminar' },
	{ label: 'CV', to: '/cv' },
]

// Navbar
const navDropdown = ref()
const navDropdown1 = ref()
const navDropdown2 = ref()
const navDropdown3 = ref()
const academicNavDropdown = ref([
	{
		label: 'Bimbingan/ KRS/ KRSS',
		value: 'bimbingan',
		icons: 'si-book',
		desc: 'Bimbingan akademik/Wali dan persetujuan KRS/KRSS',
	},
	{
		label: 'Mata Kuliah',
		value: 'matkul',
		icons: 'si-zap',
		desc: 'Informasi mata kuliah, RPS dan usulan mata kuliah',
	},
	{
		label: 'Kesediaan Mengajar',
		value: 'mengajar',
		icons: 'si-receipt-check',
		desc: 'Pegajuan kesediaan waktu mengajar setiap semester',
	},
])
const lecturesNavDropdown = ref([
	{
		label: 'Jadwal',
		value: 'jadwal',
		icons: 'si-calendar',
		desc: 'Jadwal kuliah dan kalender akademik',
	},
	{
		label: 'Kelas Kuliah',
		value: 'kelas',
		icons: 'si-black-board',
		desc: 'Informasi kelas, peserta, presensi dan nilai',
	},
	{
		label: 'BKD',
		value: 'bkd',
		icons: 'si-folder',
		desc: 'Monitoring beban kerja dosen',
	},
])
const studentActivityNavDropdown = ref([
	{
		label: 'TA/ Skripsi',
		value: 'skripsi',
		icons: 'si-blueprint-architecture',
		desc: 'Proses bimbingan dan sidang tugas akhir/ skripsi',
	},
	{
		label: 'Kerja Praktek/ PPL',
		value: 'ppl',
		icons: 'si-wrench',
		desc: 'Proses bimbingan dan sidang kerja praktek/ PPL',
	},
	{
		label: 'MBKM',
		value: 'mbkm',
		icons: 'si-backpack',
		desc: 'Daftar mahasiswa merdeka belajar kampus merdeka',
	},
	{
		label: 'Aktivitas Lain',
		value: 'other',
		icons: 'si-git-merge',
		desc: 'Daftar mahasiswa mengikuti aktivitas diluar akademik',
	},
])
const otherNavDropdown = ref([
	{
		label: 'Dosen',
		value: 'dosen',
		icons: 'si-user',
		desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, vel?',
	},
	{
		label: 'Mahasiswa',
		value: 'tubes',
		icons: 'si-users',
		desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, vel?',
	},
	{
		label: 'Presensi',
		value: 'absen',
		icons: 'si-user-check',
		desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, vel?',
	},
])

const modelDropdownEmpty = ref('')
const studentName = ref('')
const studentKeyword = ref('')

const accordionValue = ref([])
const inputValue2 = ref('asd')
const modelDropdownDefaultSelected = ref('option3')
const anotherModelDropdownDefaultSelected = ref('option1')

const dropdownItemsDefault = ref([
	{
		label: 'Option 1',
		value: 'option1',
	},
	{
		label: 'Option 2',
		value: 'option2',
	},
	{
		label: 'Option 3',
		value: 'option3',
	},
])

const dropdownItems = ref()
const dropdownPending = ref(true)

setTimeout(() => {
	dropdownItems.value = dropdownItemsDefault.value
	dropdownPending.value = false
	console.log('dropdownItems: ', dropdownItems.value)
}, 5000)

const anotherDropdownItems = ref([
	{
		label: 'Opsi 1',
		value: 'option1',
	},
	{
		label: 'Opsi 2',
		value: 'option2',
	},
	{
		label: 'Opsi 3',
		value: 'option3',
	},
])

const dataTableDialogOpened = ref(false)

const textAreaValueMaxLength = ref('')

const breadcrumbs = ref([
	{ label: 'Home', to: '/' },
	{ label: 'Library' },
	{ label: 'Data', to: '/data' },
	{ label: 'Data 2', to: '/data-2' },
	{ label: 'Data 3', to: '/data-3' },
	{ label: 'Data 4', to: '/data-4' },
	{ label: 'Data 5', to: '/data-5' },
	{ label: 'Data 6', to: '/data-6' },
	{ label: 'Data 7', to: '/data-7' },
	{ label: 'Data 8', to: '/data-8' },
	{ label: 'Data 9', to: '/data-9' },
	{ label: 'Data 10', to: '/data-10' },
	{ label: 'Data 11', to: '/data-11' },
	{ label: 'Data 12', to: '/data-12' },
	{ label: 'Data 13', to: '/data-13' },
	{ label: 'Data 14', to: '/data-14' },
	{ label: 'Data 15', to: '/data-15' },
	{ label: 'Data 16', to: '/data-16' },
	{ label: 'Data 17', to: '/data-17' },
	{ label: 'Data 18', to: '/data-18' },
	{ label: 'Data 19', to: '/data-19' },
	{ label: 'Data 20', to: '/data-20' },
	{ label: 'Data 21', to: '/data-21' },
	{ label: 'Data 22', to: '/data-22' },
	{ label: 'Data 23', to: '/data-23' },
	{ label: 'Data 24', to: '/data-24' },
	{ label: 'Data 25', to: '/data-25' },
	{ label: 'Data 26', to: '/data-26' },
	{ label: 'Data 27', to: '/data-27' },
	{ label: 'Data 28', to: '/data-28' },
])

setTimeout(() => {
	breadcrumbs.value = [
		{ label: 'Home', to: '/' },
		{ label: 'Akademik' },
		{ label: 'Persetujuan KRS/KRSS', to: '/data' },
		{ label: 'Detail Mahasiswa Bimbingan', to: '/asds' },
		{ label: 'Biodata' },
	]
}, 5000)

const selectedDateJan = ref(new CalendarDate(2024, 1, 20)) as Ref<DateValue>
const selectedDateFeb = ref(new CalendarDate(2024, 2, 20)) as Ref<DateValue>
const selectedDateDes = ref(new CalendarDate(2024, 12, 20)) as Ref<DateValue>

const onToPage = page => {
	console.log('page: ', page)
}

const mockParticipants = [
	{
		id: '220001',
		nama: 'John Doe',
		prodi: { jenjang: 'S1', nama: 'Informatika' },
		angkatan: 2021,
	},
	{
		id: '220002',
		nama: 'Jane Smith',
		prodi: { jenjang: 'S1', nama: 'Sistem Informasi' },
		angkatan: 2020,
	},
	{
		id: '220003',
		nama: 'Michael Johnson',
		prodi: { jenjang: 'D3', nama: 'Teknik Komputer' },
		angkatan: 2019,
	},
	{
		id: '220001',
		nama: 'John Doe',
		prodi: { jenjang: 'S1', nama: 'Informatika' },
		angkatan: 2021,
	},
	{
		id: '220002',
		nama: 'Jane Smith',
		prodi: { jenjang: 'S1', nama: 'Sistem Informasi' },
		angkatan: 2020,
	},
	{
		id: '220003',
		nama: 'Michael Johnson',
		prodi: { jenjang: 'D3', nama: 'Teknik Komputer' },
		angkatan: 2019,
	},
	{
		id: '220001',
		nama: 'John Doe',
		prodi: { jenjang: 'S1', nama: 'Informatika' },
		angkatan: 2021,
	},
	{
		id: '220002',
		nama: 'Jane Smith',
		prodi: { jenjang: 'S1', nama: 'Sistem Informasi' },
		angkatan: 2020,
	},
	{
		id: '220003',
		nama: 'Michael Johnson',
		prodi: { jenjang: 'D3', nama: 'Teknik Komputer' },
		angkatan: 2019,
	},
	{
		id: '220001',
		nama: 'John Doe',
		prodi: { jenjang: 'S1', nama: 'Informatika' },
		angkatan: 2021,
	},
	{
		id: '220002',
		nama: 'Jane Smith',
		prodi: { jenjang: 'S1', nama: 'Sistem Informasi' },
		angkatan: 2020,
	},
	{
		id: '220003',
		nama: 'Michael Johnson',
		prodi: { jenjang: 'D3', nama: 'Teknik Komputer' },
		angkatan: 2019,
	},
	{
		id: '220001',
		nama: 'John Doe',
		prodi: { jenjang: 'S1', nama: 'Informatika' },
		angkatan: 2021,
	},
	{
		id: '220002',
		nama: 'Jane Smith',
		prodi: { jenjang: 'S1', nama: 'Sistem Informasi' },
		angkatan: 2020,
	},
	{
		id: '220003',
		nama: 'Michael Johnson',
		prodi: { jenjang: 'D3', nama: 'Teknik Komputer' },
		angkatan: 2019,
	},
	{
		id: '220001',
		nama: 'John Doe',
		prodi: { jenjang: 'S1', nama: 'Informatika' },
		angkatan: 2021,
	},
	{
		id: '220002',
		nama: 'Jane Smith',
		prodi: { jenjang: 'S1', nama: 'Sistem Informasi' },
		angkatan: 2020,
	},
	{
		id: '220003',
		nama: 'Michael Johnson',
		prodi: { jenjang: 'D3', nama: 'Teknik Komputer' },
		angkatan: 2019,
	},
]

const selectedTime = ref<DateValue>(new CalendarDateTime(2024, 12, 25, 12, 12))

setTimeout(() => {
	selectedTime.value = new CalendarDateTime(2024, 12, 24, 13, 13)
}, 5000)

const selectedTimeNull = ref<DateValue | null>(null)

setTimeout(() => {
	selectedTimeNull.value = new CalendarDateTime(2024, 12, 24, 13, 13)
}, 5000)

function handleDatePicker(value: DateValue) {
	console.log('value: ', value)
}

const data = {
	mulai: '2025-04-17T09:20:00+07:00',
	selesai: '2025-04-20T10:11:00+07:00',
}

const startDate = ref<DateValue>(
	new CalendarDateTime(2025, 4, 17, 9, 20)
) as Ref<DateValue>
const endDate = ref<DateValue>(
	new CalendarDateTime(2025, 4, 20, 10, 11)
) as Ref<DateValue>
// const startDate = ref<DateValue>(
// 	new CalendarDateTime(
// 		new Date(data.mulai).getFullYear(),
// 		new Date(data.mulai).getMonth() + 1,
// 		new Date(data.mulai).getDate(),
// 		new Date(data.mulai).getHours(),
// 		new Date(data.mulai).getMinutes(),
// 		new Date(data.mulai).getSeconds()
// 	)
// )
// const endDate = ref<DateValue>(
// 	new CalendarDateTime(
// 		new Date(data.selesai).getFullYear(),
// 		new Date(data.selesai).getMonth() + 1,
// 		new Date(data.selesai).getDate(),
// 		new Date(data.selesai).getHours(),
// 		new Date(data.selesai).getMinutes(),
// 		new Date(data.selesai).getSeconds()
// 	)
// )

function validateDateRange(
	startDate: CalendarDate | string | null,
	endDate: CalendarDate | string | null
): boolean {
	// Log untuk debugging
	console.log('startDate: ', startDate)
	console.log('endDate: ', endDate)

	// Jika salah satu tanggal tidak ada, anggap valid
	if (!startDate || !endDate) {
		return true
	}

	// Konversi startDate ke CalendarDate jika berupa string
	let parsedStartDate: CalendarDate
	if (typeof startDate === 'string') {
		const [day, month, year] = startDate.split('-').map(Number)
		parsedStartDate = new CalendarDate(year, month, day)
	} else {
		parsedStartDate = startDate
	}

	// Konversi endDate ke CalendarDate jika berupa string
	let parsedEndDate: CalendarDate
	if (typeof endDate === 'string') {
		const [day, month, year] = endDate.split('-').map(Number)
		parsedEndDate = new CalendarDate(year, month, day)
	} else {
		parsedEndDate = endDate
	}

	return parsedStartDate <= parsedEndDate
}

const modelTextEditor = ref('')
function submitTextEditor() {
	console.log('modelTextEditor: ', modelTextEditor.value)
}

// @ts-ignore
import ImageKit from 'imagekit'
import CobaInfiniteScroll from '../components/CobaInfiniteScroll.vue'
var imagekit = new ImageKit({
	privateKey: 'private_QbfGRQcKnledpKfDXDu9HkzrfsY=',
	publicKey: 'public_ahhX9tTGHfo2XldIU69e499BSk4=',
	urlEndpoint: 'https://ik.imagekit.io/upez1g3ix/',
})

async function preUploadImage(file: File): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		try {
			imagekit.upload(
				{
					file: file,
					fileName: file.name,
					tags: ['tag1'],
				},
				function (err, result) {
					console.log('upload success', result.url)

					resolve(result.url)
				}
			)
		} catch (error) {
			console.error('Upload error:', error)
			reject('https://via.placeholder.com/300?text=Upload+Failed')
		}
	})
}

function uploadImage(file: File): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		setTimeout(() => {
			resolve(
				'https://images.unsplash.com/photo-1742943892627-f7e4ddf91224?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
			)
		}, 2000)
	})
}
const numericInput = ref('')
const textEditorDialog = ref(false)

const icons = ['si-lock', 'si-lock-alt', 'si-lock-solid', 'si-lock-circle']

// CYPRESS
const cyNumericFractionDigits = ref()
const cyTextMaxLength = ref()
</script>

<template>
	<CobaInfiniteScroll />
	<DataTableInfiniteScroll />
	<div class="flex flex-wrap gap-4">
		<div
			v-for="size in Array.from({ length: 10 }, (_, i) => (i + 1) * 10)"
			:key="size"
			:class="`rounded bg-orange-${size} w-24 h-24`"
		></div>
	</div>

	<div class="flex gap-4">
		<span v-for="(icon, index) in icons" :key="index">
			<i :class="icon" />
		</span>
	</div>
	number input
	<Input v-model="numericInput" type="number" decimal :max-length="10" />
	<Button class="my-5" @click="textEditorDialog = true"
		>Open Text Editor</Button
	>
	<FormInput @submit="submitTextEditor">
		<div>
			<SRichTextEditor
				id="my-text-editor"
				v-model="modelTextEditor"
				:image-upload-handler="preUploadImage"
				:video-upload-handler="preUploadImage"
				:attachment-upload-handler="preUploadImage"
				data-cy="my-text-editor"
				placeholder="Tulis disini"
				required
			>
				<template #required>wajib diisi</template>
			</SRichTextEditor>
		</div>
		<div class="flex items-center justify-end gap-2 mt-10 w-full">
			<Button outlined @click="textEditorDialog = false">Kembali</Button>
			<Button type="submit"> Submit </Button>
		</div>
	</FormInput>
	<Dialog v-model:open="textEditorDialog">
		<DialogContent class="w-1/2">
			<FormInput @submit="submitTextEditor">
				<div>
					<SRichTextEditor
						v-model="modelTextEditor"
						:image-upload-handler="preUploadImage"
						:video-upload-handler="preUploadImage"
						:attachment-upload-handler="preUploadImage"
						placeholder="Tulis disini"
						required
					>
						<template #required>wajib diisi</template>
					</SRichTextEditor>
				</div>
				<div class="flex items-center justify-end gap-2 mt-10 w-full">
					<Button outlined @click="textEditorDialog = false">Kembali</Button>
					<Button type="submit"> Submit </Button>
				</div>
			</FormInput>
		</DialogContent>
	</Dialog>

	<FormInput @submit="handleDatePicker">
		<DatePicker v-model="startDate" required>
			<template #required>
				<span>isi dong</span>
			</template>
			<template #errors="{ validation }">
				<p v-if="validation.dateRange.$invalid">harus kurang dari enddate</p>
			</template>
		</DatePicker>

		<TimePicker v-model="startDate">
			<template #required>
				<span>isi dong</span>
			</template>
			<template #errors="{ validation }">
				<p v-if="validation.dateRange.$invalid">harus lebih dari startdate</p>
			</template>
		</TimePicker>
		<DatePicker v-model="endDate" required>
			<template #required>
				<span>isi dong</span>
			</template>
			<template #errors="{ validation }">
				<p v-if="validation.dateRange.$invalid">harus lebih dari startdate</p>
			</template>
		</DatePicker>
		<TimePicker v-model="endDate">
			<template #required>
				<span>isi dong</span>
			</template>
			<template #errors="{ validation }">
				<p v-if="validation.dateRange.$invalid">harus lebih dari startdate</p>
			</template>
		</TimePicker>
		<Input v-model="inputValue" :maxlength="10" :minlength="2" required>
			<template #required>
				wajib diisi Then try running your publish or build command
				again.</template
			>
		</Input>
		<Textarea
			v-model="inputValue"
			:maxlength="10"
			:minlength="2"
			class="max-w-72"
			required
		>
			<template #required>
				wajib diisi Then try running your publish or build command
				again.</template
			>
		</Textarea>
		{{ startDate }}
		{{ endDate }}
		<Button type="submit">submit dong</Button>
	</FormInput>
	<!-- 
	<div class="w-44">
		<DatePicker v-model="selectedTime" />
		<TimePicker v-model="selectedTime" />
		if null value will be return date time now
		<DatePicker v-model="selectedTimeNull" />
		<TimePicker v-model="selectedTimeNull" />
	</div> -->

	<div class="w-min">
		<Calendar
			v-model="selectedDateJan"
			locale="id"
			:importantDates="extractBEResponse"
			:show-outside-view-dates="false"
			data-cy="my-calendar"
		>
			<template #header>
				<CalendarHeading class="m-auto" />
			</template>
		</Calendar>
		<Calendar
			v-model="selectedDateFeb"
			:importantDates="importantDates"
			:years-range="[1975]"
			locale="id"
			@month-change="onToPage"
			@year-change="onToPage"
		/>
		<Calendar
			v-model="selectedDateDes"
			:readonly="true"
			:month-navigation="false"
			:importantDates="importantDates"
			:show-outside-view-dates="false"
			locale="id"
		/>
	</div>

	<div class="mb-10">
		<Textarea
			v-model="textAreaValueMaxLength"
			:maxlength="20"
			:minlength="2"
			class="max-w-72"
			required
		>
			<template #required> wajib diisi </template>
			<template #minlength> minimal 2 karakter</template>
		</Textarea>
	</div>
	<Textarea v-model="textAreaValueMaxLength" />

	<div>
		<div class="flex flex-col gap-4 mb-4">
			<Alert variant="warning" :closable="false" bordered outlined>
				<AlertDescription>
					<div class="flex flex-col items-start justify-start mt-[2px]">
						<h1 class="font-bold">Informasi</h1>
						<ul class="list-decimal mt-2 text-start ml-4">
							<li>
								Mata Kuliah dengan tanda bintang satu (*) adalah Mata Kuliah
								Pilihan
							</li>
							<li>
								Mata Kuliah dengan tanda bintang dua (**) adalah Mata Kuliah
								Konsentrasi
							</li>
							<li>Klik tombol 'Ambil' untuk memilih mata kuliah pengganti</li>
							<li class="text-red-500">
								Mata Kuliah dengan blok warna Merah adalah mata kuliah yang akan
								diganti
							</li>
							<li class="text-yellow-500">
								Mata Kuliah dengan blok warna Kuning adalah mata kuliah yang
								sudah diambil Mahasiswa
							</li>
						</ul>
					</div>
				</AlertDescription>
			</Alert>
			<Alert variant="warning" :closable="false" outlined>
				<AlertDescription> outlined </AlertDescription>
			</Alert>
			<Alert variant="warning" :closable="false" bordered>
				<AlertDescription> bordered </AlertDescription>
			</Alert>
			<Alert variant="warning" :closable="false" bordered outlined>
				<AlertDescription> bordered outline </AlertDescription>
			</Alert>
			<Alert variant="primary" :closable="false">
				<AlertDescription>Primary</AlertDescription>
			</Alert>
			<Alert variant="danger">
				<AlertDescription>danger</AlertDescription>
			</Alert>
			<Alert variant="success">
				<AlertDescription>success</AlertDescription>
			</Alert>
			<Alert variant="info" :closable="false">
				<AlertDescription>info</AlertDescription>
			</Alert>
		</div>
	</div>
	<Input v-model="modelDropdownEmpty" type="text" :max-length="10" />
	<Dropdown v-model="modelDropdownEmpty" class="w-full" data-cy="link-dropdown">
		<DropdownItem key="" value="">
			<span>value empty</span>
		</DropdownItem>
		<DropdownItem v-for="index in 10" :key="index" :value="index">
			<div class="black">
				<a href="/">
					Yo
					<a :href="`/dropdown/${index}`">
						<a href="/dropdown/${index}">
							<span>{{ index }}</span>
						</a>
					</a>
				</a>
			</div>
		</DropdownItem>
	</Dropdown>
	modelDropdownDefaultSelected
	<Dropdown
		v-model="modelDropdownDefaultSelected"
		:pending="dropdownPending"
		class="w-full"
	>
		<DropdownItem key="" value="">
			<span>value empty</span>
		</DropdownItem>
		<DropdownItem
			v-for="item in dropdownItems"
			:key="item.value"
			:value="item.value"
		>
			<span>{{ item.label }}</span>
		</DropdownItem>
	</Dropdown>
	anotherModelDropdownDefaultSelected
	<Dropdown v-model="anotherModelDropdownDefaultSelected" class="w-full">
		<DropdownItem key="" value="">
			<span>value empty</span>
		</DropdownItem>
		<DropdownItem
			v-for="item in anotherDropdownItems"
			:key="item.value"
			:value="item.value"
		>
			<span>{{ item.label }}</span>
		</DropdownItem>
	</Dropdown>
	Student: {{ studentName }}
	<Dropdown v-model="studentName" class="w-full">
		<template #trigger>
			<Input v-model="studentKeyword" class="w-full" />
		</template>
		<DropdownItem
			v-for="item in anotherDropdownItems"
			:key="item.value"
			:value="item.value"
		>
			<span>{{ item.label }}</span>
		</DropdownItem>
	</Dropdown>
	<NavigationMenu class="my-3 shadow-lg">
		<NavigationMenuItem as="router-link" to="/" :isActive="true">
			<i class="si-home-alt"></i>
			<p>Beranda</p>
		</NavigationMenuItem>

		<NavigationMenuItem as="router-link" to="/profil">
			<i class="si-user-alt"></i>
			<p>Profil</p>
		</NavigationMenuItem>

		<Dropdown v-model="navDropdown">
			<template #trigger>
				<NavigationMenuItem as="div" hasDropdown>
					<i class="si-book"></i>
					<p>Akademik</p>
				</NavigationMenuItem>
			</template>
			<DropdownItem
				v-for="(item, index) in academicNavDropdown"
				:key="index"
				:value="item.value"
				class="max-w-xs m-4 rounded-lg text-neutral-100 navbar__dropdown-item"
			>
				<div class="flex items-start">
					<i :class="item.icons" class="text-primary-100 text-xl" />
					<div class="ml-3 text-left">
						<p class="font-bold text-base">{{ item.label }}</p>
						<p class="text-neutral-80 max-w-60">{{ item.desc }}</p>
					</div>
				</div>
			</DropdownItem>
		</Dropdown>

		<Dropdown v-model="navDropdown1">
			<template #trigger>
				<NavigationMenuItem as="div" hasDropdown>
					<i class="si-work-agenda"></i>
					<p>Perkuliahan</p>
				</NavigationMenuItem>
			</template>
			<DropdownItem
				v-for="(item, index) in lecturesNavDropdown"
				:key="index"
				:value="item.value"
				class="max-w-xs m-4 rounded-lg text-neutral-100 navbar__dropdown-item"
			>
				<div class="flex items-start">
					<i :class="item.icons" class="text-primary-100 text-xl" />
					<div class="ml-3 text-left">
						<p class="font-bold text-base">{{ item.label }}</p>
						<p class="text-neutral-80 max-w-[14.3rem]">{{ item.desc }}</p>
					</div>
				</div>
			</DropdownItem>
		</Dropdown>

		<Dropdown v-model="navDropdown1">
			<template #trigger>
				<NavigationMenuItem as="div" hasDropdown>
					<i class="si-mountain"></i>
					<p>Aktivitas Mahasiswa</p>
				</NavigationMenuItem>
			</template>
			<DropdownItem
				v-for="(item, index) in studentActivityNavDropdown"
				:key="index"
				:value="item.value"
				class="max-w-xs m-4 rounded-lg text-neutral-100 navbar__dropdown-item"
			>
				<div class="flex items-start">
					<i :class="item.icons" class="text-primary-100 text-xl" />
					<div class="ml-3 text-left">
						<p class="font-bold text-base">{{ item.label }}</p>
						<p class="text-neutral-80 max-w-[14.3rem]">{{ item.desc }}</p>
					</div>
				</div>
			</DropdownItem>
		</Dropdown>

		<NavigationMenuItem as="router-link" to="/honor">
			<i class="si-wallet-money"></i>
			<p>Honor</p>
		</NavigationMenuItem>

		<NavigationMenuItem as="div" hasDropdown>
			<i class="si-clipboard"></i>
			<p>Laporan</p>
		</NavigationMenuItem>

		<NavigationMenuItem as="div" to="/panduan">
			<i class="si-flag"></i>
			<p>Panduan</p>
		</NavigationMenuItem>
		<NavigationMenuItem as="div" to="/akun-lain">
			<i class="si-user-alt-2"></i>
			<p>Profil</p>
		</NavigationMenuItem>
	</NavigationMenu>
	<div class="flex gap-4">
		<Sidemenu class="shadow-md" :items="menuItems" :defaultActiveIndex="0" />
		<div>
			<div class="flex bg-primary-60 items-center">
				<a href="https://vite.dev" target="_blank">
					<img src="/vite.svg" class="logo" alt="Vite logo" />
				</a>
				<a href="https://vuejs.org/" target="_blank">
					<img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
				</a>
				<div class="flex gap-4 items-center">
					<p class="font-bold text-neutral-10">Ganti Tema Warna</p>
					<Dropdown v-model="theme" @typing="onSearch">
						<DropdownItem
							v-for="(item, index) in themes"
							:key="index"
							:value="item.value"
							@select="onChangeTheme"
						>
							<span class="flex items-center gap-2">
								{{ item.label }}
							</span>
						</DropdownItem>
					</Dropdown>
				</div>
				<div class="ml-8">
					<Switch v-model="mode" true-value="dark" false-value="" variant="grey"
						>Dark Mode</Switch
					>
				</div>
			</div>
			<div class="flex gap-4 mt-4">
				<div class="bg-danger-100 h-64">asd</div>
				<div class="flex flex-col gap-4">
					<div class="flex gap-4">
						<Button @click="onClickButton">Primary</Button>
						<Button variant="danger" @click="onClickButton">Danger</Button>
						<Button variant="warning" @click="onClickButton">Warning</Button>
						<Button variant="success" @click="onClickButton">Success</Button>
						<Button variant="danger" disabled @click="onClickButton"
							>Disabled</Button
						>
						<Button variant="secondary" @click="onClickButton"
							>secondary</Button
						>
					</div>
					<div class="flex gap-4">
						<Button outlined @click="onClickButton">Primary</Button>
						<Button outlined variant="danger" @click="onClickButton"
							>Danger</Button
						>
						<Button outlined variant="warning" @click="onClickButton"
							>Warning</Button
						>
						<Button outlined variant="success" @click="onClickButton"
							>Success</Button
						>
						<Button outlined variant="danger" disabled @click="onClickButton"
							>Disabled</Button
						>
					</div>
					<div class="flex gap-4">
						<Button rounded @click="onClickButton">Primary</Button>
						<Button rounded variant="danger" @click="onClickButton"
							>Danger</Button
						>
						<Button rounded variant="warning" @click="onClickButton"
							>Warning</Button
						>
						<Button rounded variant="success" @click="onClickButton"
							>Success</Button
						>
						<Button rounded variant="danger" disabled @click="onClickButton"
							>Disabled</Button
						>
					</div>
					<div class="flex gap-4">
						<Button rounded outlined @click="onClickButton">Primary</Button>
						<Button rounded outlined variant="danger" @click="onClickButton"
							>Danger</Button
						>
						<Button rounded outlined variant="warning" @click="onClickButton"
							>Warning</Button
						>
						<Button rounded outlined variant="success" @click="onClickButton"
							>Success</Button
						>
						<Button
							rounded
							outlined
							variant="danger"
							disabled
							@click="onClickButton"
							>Disabled</Button
						>
					</div>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<Badge variant="primary" size="small" closeable>Primary</Badge>
				<Badge variant="danger" size="medium" rounded closeable>Danger</Badge>
				<Badge variant="warning" size="large" closeable>Warning</Badge>
			</div>
			<HelloWorld msg="Vite + Vue" />
			<Skeleton class="h-[125px] w-[250px] rounded-none" />
			<div>
				<Pagination
					v-model:perPage="perPage"
					v-model:page="page"
					total="75"
					per-page-label-text="Tampilkeun"
					data-cy="custom-pagination"
					:per-page-item-formatter="number => `${number} siki sakaca`"
				/>

				<div class="my-5">
					<div class="font-semibold text-2xl text-neutral-90">
						Pagination Without Per Page
					</div>
					<Pagination
						v-model:perPage="perPage"
						v-model:page="page"
						total="75"
						per-page-label-text="Tampilkeun"
						:per-page-item-formatter="number => `${number} siki sakaca`"
						:show-per-page-options="false"
						:show-pagination-input="false"
					/>
				</div>
			</div>
			<div class="my-10">
				<div class="grid grid-cols-2 gap-2 my-10">
					<FormInput class="border">
						<Dropdown
							v-model="modelDropdown"
							searchable
							required
							class="w-full"
							data-cy="model-dropdown"
							data-cy-search-input="dropdown-search-data-cy"
							:custom-validators="{ test: value => value === 'option1' }"
							@typing="onSearch"
						>
							<DropdownItem
								v-for="(item, index) in optionDropdown"
								:key="index"
								:value="item.value"
								:disabled="index === 4"
								@select="onSelect"
							>
								<span class="flex items-center gap-2">
									<i :class="item.icons" />
									{{ item.label }}
								</span>
							</DropdownItem>
							<template #required="{ validation }">
								<p v-if="validation.required.$invalid">harus di isi</p>
							</template>
							<template #errors="{ validation }">
								<p v-if="validation.test.$invalid">haha error</p>
							</template>
						</Dropdown>

						<Input
							v-model="decimalValue"
							type="numeric"
							decimal
							:max-fraction-digits="2"
							required
						>
							<template #required> wajib diisi </template>
						</Input>
						<button type="submit" class="text-neutral-100">Submit ah</button>
					</FormInput>
					<div>
						<FormInput>
							<Dropdown
								v-model="modelDropdownTrigger"
								ignore-active-item-value
								data-cy="dropdown-with-custom-trigger"
							>
								<template #trigger>
									<Button rounded variant="primary" size="sm">Open</Button>
								</template>
								<div>
									<DropdownItem
										v-for="(item, index) in optionDropdown"
										:key="index"
										:value="item.value"
										:disabled="index === 0"
									>
										<span class="flex w-full items-center">
											<i :class="item.icons" class="mr-2" />
											{{ item.label }}
										</span>
									</DropdownItem>
								</div>
							</Dropdown>

							<button type="submit" class="text-neutral-100">Submit ah</button>
						</FormInput>
					</div>
				</div>
				<div>
					<span class="text-neutral-100">
						{{ modelDropdownMultiple }}
					</span>
					<Dropdown
						v-model="modelDropdownMultiple"
						searchable
						multiple
						@typing="onSearch"
					>
						<DropdownItem
							v-for="(item, index) in optionDropdown"
							:key="index"
							:value="item"
						>
							<span class="flex items-center gap-2">
								{{ item.label }}
							</span>
						</DropdownItem>
					</Dropdown>
				</div>
				<div class="flex gap-2">
					<div v-for="(item, index) in switchModel" :key="index" class="mb-4">
						<Switch
							v-model="item.model"
							:disabled="item.disabled"
							:variant="item.variant"
						>
							<span class="text-neutral-100">
								{{ item.label }}: {{ item.model }}
							</span>
						</Switch>
					</div>
					<span class="text-neutral-100"
						>disabled <Switch v-model="switchDisable" :disabled="true" />
					</span>
				</div>
			</div>
			<div class="flex flex-col gap-4 mb-8">
				<div class="flex gap-4">
					<div class="text-left">
						<label for="name" class="text-left text-sm font-semibold"
							>Name</label
						>
						<Input
							placeholder="Enter your name"
							required
							@keydown="console.log($event)"
						>
							<template #prefix>
								<i class="si-user"></i>
							</template>
							<template #required> Required </template>
						</Input>
					</div>
					<div class="text-left">
						<label for="name" class="text-left text-sm font-semibold"
							>Name</label
						>
						<Input placeholder="Enter your name" required>
							<template #prefix>
								<i class="si-user"></i>
							</template>
							<template #required> Required </template>
						</Input>
					</div>
				</div>
				<div class="text-left">
					<label for="name" class="text-left text-sm font-semibold">Name</label>
					<Input placeholder="Enter your name" required>
						<template #prefix>
							<i class="si-user"></i>
						</template>
						<template #required> Required </template>
					</Input>
				</div>
				<div class="text-left">
					<label for="name" class="text-left text-sm font-semibold">Name</label>
					<Input v-model="inputValue" placeholder="Enter your name" required>
						<template #prefix>
							<i class="si-user"></i>
						</template>
						<template #required>
							Lorem Ipsum is simply dummy text of the printing and typesetting
							industry. Lorem Ipsum has been the industry's standard dummy text
							ever since the 1500s, when an unknown printer took a galley of
							type and scrambled it to make a type specimen book. It has
							survived not only five centuries, but also the leap into
							electronic typesetting, remaining essentially unchanged. It was
							popularised in the 1960s with the release of Letraset sheets
							containing Lorem Ipsum passages, and more recently with desktop
							publishing software like Aldus PageMaker including versions of
							Lorem Ipsum.
						</template>
					</Input>
				</div>
				<div class="flex gap-4">
					<div class="text-left">
						<label for="name" class="text-left text-sm font-semibold"
							>Name</label
						>
						<Input placeholder="Enter your name" required>
							<template #prefix>
								<i class="si-user"></i>
							</template>
							<template #required> Required </template>
						</Input>
					</div>
					<div class="text-left">
						<label for="name" class="text-left text-sm font-semibold"
							>Name</label
						>
						<Input placeholder="Enter your name" required>
							<template #prefix>
								<i class="si-user"></i>
							</template>
							<template #required> Required </template>
							<template #errors="{ validation }">
								<p v-if="validation.required.$invalid">Required</p>
							</template>
						</Input>
					</div>
				</div>
			</div>

			<span class="flex items-start gap-4 mb-2 text-neutral-100">
				<Checkbox
					v-model="customCheckbox"
					variant="success"
					size="4xl"
					:value="true"
					always-show-indicator
					rounded
				>
					<template #indicator>H</template>
				</Checkbox>
				<Checkbox
					v-model="customCheckbox"
					variant="danger"
					size="4xl"
					:value="true"
					always-show-indicator
					rounded
				>
					<template #indicator> A </template>
				</Checkbox>
				<Checkbox
					v-model="customCheckbox"
					size="4xl"
					:value="true"
					always-show-indicator
					rounded
				>
					<template #indicator> B </template>
				</Checkbox>
			</span>

			<span class="flex items-start gap-4 mb-4 text-neutral-100">
				Disabled
				<Checkbox
					v-model="customCheckbox"
					variant="success"
					size="4xl"
					:value="true"
					always-show-indicator
					disabled
					rounded
				>
					<template #indicator>H</template>
				</Checkbox>
				<Checkbox
					v-model="customCheckbox"
					variant="danger"
					size="4xl"
					:value="true"
					always-show-indicator
					disabled
					rounded
				>
					<template #indicator> A </template>
				</Checkbox>
				<Checkbox
					v-model="customCheckbox"
					size="4xl"
					:value="true"
					always-show-indicator
					disabled
					rounded
				>
					<template #indicator> B </template>
				</Checkbox>
			</span>

			<span class="text-neutral-100 flex items-start gap-4">
				<Checkbox
					v-model="customCheckbox"
					variant="success"
					size="3xl"
					:value="true"
					rounded
				>
					<template #indicator>
						<img src="/lib/assets/icons/check-circle.svg" class="w-9" />
					</template>
					Lg
				</Checkbox>
				<Checkbox
					v-model="customCheckbox"
					variant="success"
					size="lg"
					:value="true"
					rounded
				>
					<template #indicator>
						<img src="/lib/assets/icons/check-circle.svg" />
					</template>
					Lg
				</Checkbox>
				<Checkbox
					v-model="customCheckbox"
					variant="primary light"
					size="md"
					checked-icon="si-check-alt"
					:value="true"
					rounded
				>
					Md
				</Checkbox>
				<Checkbox
					v-model="customCheckbox"
					size="sm"
					variant="light warning"
					:value="true"
					rounded
				>
					Sm
				</Checkbox>
			</span>

			<span class="text-neutral-100 flex">
				<Checkbox :model-value="{ value: 1 }" :value="{ value: 1 }" />
				checkboxmaul {{ checkboxmaul }}
			</span>

			<Checkbox
				ref="checkboxRef"
				:model-value="selectedOptions.length > 0"
				:indeterminate="
					selectedOptions.length > 0 &&
					selectedOptions.length < checkboxOptions.length
				"
				:value="true"
				required
				disabled
			>
				Pilih Semua
			</Checkbox>
			<div class="flex flex-col gap-2 m-6">
				<div v-for="option in checkboxOptions" :key="option.value">
					<Checkbox
						:key="option.value"
						v-model="selectedOptions"
						:label="option.label"
						:value="option.value"
						variant="success"
						class="items-start"
					>
						<p class="font-semibold mb-2">Remember Me!</p>
						{{ option.label }} Save my login details for next time.
					</Checkbox>
				</div>
			</div>
			<FormInput>
				<CheckboxGroup
					:value="selectedOptions"
					:custom-validators="{ test: value => value === 'test' }"
				>
					<div v-for="option in checkboxOptions" :key="option.value">
						<Checkbox
							:key="option.value"
							v-model="selectedOptions"
							:label="option.label"
							:value="option.value"
							variant="success"
							class="items-start"
						>
							<p class="font-semibold mb-2">Remember Me!</p>
							{{ option.label }} Save my login details for next time.
						</Checkbox>
					</div>
					<template #errors="{ validation }">
						<p v-if="validation.test.$invalid">Test error</p>
					</template>
				</CheckboxGroup>
				<button type="submit" class="text-neutral-100">Submit</button>
			</FormInput>
			<Breadcrumb>
				<BreadcrumbItem to="/">
					<i class="si-home-fill text-primary-100 text-lg" />
				</BreadcrumbItem>
				<BreadcrumbItem
					v-for="item in breadcrumbs"
					:key="item.label"
					:to="item.to"
				>
					{{ item.label }}
				</BreadcrumbItem>
			</Breadcrumb>

			<RadioGroup v-model="selectedRadio">
				<RadioGroupItem :value="{ id: 1 }">Option 1</RadioGroupItem>
				<RadioGroupItem value="option2" variant="success" disabled
					>Option 2</RadioGroupItem
				>
				<RadioGroupItem value="option3" variant="danger"
					>Option 3</RadioGroupItem
				>
				<template #errors="{ validation }">
					<p v-if="validation.test.$invalid">Test error</p>
				</template>
			</RadioGroup>
			<Toaster position="bottom-right" />
			<Button
				@click="
					toast({
						title: 'Hello World',
						description: 'This is a toast message',
						variant: 'success',
						indefinite: true,
					})
				"
				>Show Toast</Button
			>
			<FormInput class="p-6">
				<div class="grid grid-cols-2 gap-4">
					<Input placeholder="Nama" disabled />
					<DatePicker v-model="startDate" required>
						<template #required>
							<span>isi dong</span>
						</template>
						<template #errors="{ validation }">
							<p v-if="validation.dateRange.$invalid">
								harus kurang dari enddate
							</p>
						</template>
					</DatePicker>
					<Upload
						v-model="selectedFiles"
						readonly
						:required="true"
						label="Lampirkan file"
					>
					</Upload>
					<Upload
						v-model="selectedFiles"
						disabled
						:required="true"
						label="Lampirkan file"
					>
					</Upload>
					<Upload
						v-model="selectedFiles2"
						:max-size="11 * 1000 * 1000"
						label="Lampirkan file dong"
						:file-types="['application/pdf']"
						accept="application/pdf"
						class="w-1/2"
						data-cy="upload"
					>
						<template #maxSize>
							<p>Max size</p>
						</template>
						<template #fileType> Invalid file type </template>
						<template #errors="{ validation }">
							<p v-if="validation.test.$invalid">Test error</p>
						</template>
					</Upload>
				</div>
				<button type="submit" class="text-neutral-100">Submit</button>
			</FormInput>
			<Tooltip>
				<template #trigger>
					<Button>Hover me</Button>
				</template>
				<TooltipContent variant="success" position="right">
					<div class="w-96">
						Lorem Ipsum is simply dummy text of the printing and typesetting
						industry. Lorem Ipsum has been the industry's standard dummy text
						ever since the 1500s, when an unknown printer took a galley of type
						and scrambled it to make a type specimen book. It has survived not
						only five centuries, but also the leap into electronic typesetting,
						remaining essentially unchanged. It was popularised in the 1960s
						with the release of Letraset sheets containing Lorem Ipsum passages,
						and more recently with desktop publishing software like Aldus
						PageMaker including versions of Lorem Ipsum.
					</div></TooltipContent
				>
			</Tooltip>
			<Loading ref="loading" />

			<Dialog v-model:open="dialogOpened">
				<DialogContent class="text-neutral-100 text-center w-[400px]">
					<div class="flex flex-col gap-2 justify-center">
						<div
							class="rounded-full h-12 w-12 flex items-center justify-center bg-success-100/10 m-auto"
						>
							<div
								class="rounded-full h-9 w-9 flex items-center justify-center bg-success-100/20"
							>
								<i class="si-check-circle text-success-100 h-4 w-4"></i>
							</div>
						</div>
						<h2 class="text-xl font-bold">Successfull</h2>
						<p class="text-neutral-60 text-sm">
							This blog post has been published. Team members will be able to
							edit this post and republish changes.
						</p>
						<div class="flex gap-4">
							<Button outlined class="w-full" @click="dialogOpened = false"
								>Batal</Button
							>
							<Button class="w-full">Confirm</Button>
							<Button @click="$refs.loading.open()">LOADING</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
			<Button @click="dialogOpened = true">Open Dialog</Button>
			<Button @click="$refs.loading.open()">LOADING</Button>

			<div class="text-black">
				<Accordion class="w-full" type="multiple">
					<AccordionItem
						v-for="item in accordionItems"
						:key="item.value"
						:value="item.value"
					>
						<AccordionTrigger>
							<template #label>
								{{ item.title }}
							</template>
						</AccordionTrigger>
						<AccordionContent>
							{{ item.content }}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>

			<Button outlined @click="dialogOpened = true">Open Dialog</Button>

			<div class="bg-white p-4">
				<div v-for="(tabConfig, index) in tabsConfig" :key="index">
					<Tabs
						:default-value="tabConfig.defaultValue"
						:variant="tabConfig.variant"
					>
						<TabsList>
							<TabsTrigger
								v-for="(trigger, idx) in tabConfig.triggers"
								:key="idx"
								:value="trigger.value"
								:badge-count="trigger.badgeCount"
							>
								{{ trigger.label }}
							</TabsTrigger>
						</TabsList>
						<TabsContent
							v-for="(content, idx) in tabConfig.contents"
							:key="idx"
							:value="content.value"
							class="text-black"
						>
							<Card>
								<CardHeader>
									<CardTitle>{{ content.text }}</CardTitle>
									<CardDescription
										>Deploy your new project in one-click.</CardDescription
									>
								</CardHeader>
								<CardContent>
									Lorem ipsum dolor sit amet consectetur adipisicing elit.
									Cupiditate illum repellat et ipsam voluptatum aliquam
									aspernatur nostrum impedit dolores repudiandae, alias
									praesentium laudantium corporis eveniet eius consectetur nemo
									harum! Accusamus.
								</CardContent>
								<CardFooter class="flex justify-between px-6 pb-6">
									<Button> Cancel </Button>
									<Button>Deploy</Button>
								</CardFooter>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>

			<Button @click="dialogOpened = true">Open Dialog</Button>

			<FormInput
				class="bg-white rounded-3xl my-3"
				@submit="console.log('submit date', $event)"
			>
				<div class="px-2">
					<div class="p-4 w-72">
						<DatePicker
							v-model="selectedDateNullAtFirst"
							class="w-full"
							placeholder="dd-mm-yyyy 1"
							:importantDates="importantDates"
							:required="true"
							:disabled="false"
							data-cy="date-picker-1"
						>
							<template #required> Please select a date </template>
						</DatePicker>
					</div>
					<div class="p-4 w-72">
						<DatePicker
							v-model="selectedDate"
							class="w-full"
							placeholder="dd-mm-yyyy"
							:importantDates="importantDates"
							:required="true"
							:disabled="true"
						>
							<template #required> Please select a date </template>
						</DatePicker>
					</div>
					<div class="p-4">
						<DatePicker
							v-model:start="selectedDateNullAtFirst"
							v-model:end="selectedDateNullAtFirst"
							class="w-full"
							placeholder="Pilih rentang tanggal"
							date-range
							:importantDates="importantDates"
							format-date="full"
							:required="true"
							:years-range="[1976]"
						>
							<template #required> Please select a date range </template>
						</DatePicker>
					</div>
					<div class="p-4">
						<DatePicker
							v-model:start="selectedStartDate"
							v-model:end="selectedEndDate"
							class="w-full"
							placeholder="Pilih rentang tanggal"
							date-range
							:importantDates="importantDates"
							format-date="full"
							:required="true"
							:disabled="true"
						>
							<template #required> Please select a date range </template>
						</DatePicker>
					</div>
				</div>
				<button type="submit" class="py-2 text-neutral-100">Submit Date</button>
			</FormInput>

			<DatePicker
				v-model="selectedDate"
				placeholder="Pilih tanggal"
				:importantDates="importantDates"
			/>
			{{ selectedDate }}
			<DatePicker
				v-model:start="selectedStartDate"
				v-model:end="selectedEndDate"
				placeholder="Pilih rentang tanggal"
				date-range
				:importantDates="importantDates"
				data-cy="date-range-picker"
				format-date="full"
			/>
			{{ selectedStartDate }}
			{{ selectedEndDate }}
			<div class="flex flex-col">
				<div class="flex">
					<Calendar v-model="selectedDate" :importantDates="importantDates" />
				</div>
				{{ selectedDate }}
			</div>
			<div class="flex flex-col">
				RANGE CALENDAR
				<div class="flex">
					<RangeCalendar
						v-model="selectedRangeDate"
						:importantDates="importantDates"
					/>
				</div>
				{{ selectedRangeDate }}
			</div>
			{{ importantDates }}

			<span class="text-black"> {{ selectedStartDate }} </span>
			<Button outlined @click="dialogOpened = true">Open Dialog</Button>
			<h1 class="text-neutral-100 my-3">TextArea Example</h1>

			JAI
			<FormInput @submit="console.log('submit', $event)">
				<Input
					id="my-textarea"
					v-model="inputValue"
					placeholder="Tulis sesuatu..."
					type="email"
				>
					<!-- <template #exact	Length> exacrt </template> -->
					<template #email> email salah</template>
				</Input>
				<Button type="submit">Submit</Button>
			</FormInput>
		</div>
	</div>
	<div class="bg-neutral-10">
		<Card shadow rounded border>
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card Description</CardDescription>
			</CardHeader>
			<CardContent> This is the card content. </CardContent>
			<CardFooter class="flex justify-between px-6 pb-6">
				Card Footer
			</CardFooter>
		</Card>

		<FormInput class="text-black" @submit="console.log('submit', $event)">
			<Accordion
				v-model="accordionValue"
				type="multiple"
				class="w-full"
				collapsible
				:destroy-on-hide="false"
			>
				<AccordionItem value="1">
					<AccordionTrigger>Trigger </AccordionTrigger>
					<AccordionContent>
						<Input v-model="inputValue" placeholder="Enter your name" required>
							<template #prefix>
								<i class="si-user"></i>
							</template>
							<template #required> Required </template>
						</Input>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="2">
					<AccordionTrigger>Trigger </AccordionTrigger>
					<AccordionContent>
						<Input v-model="inputValue2" placeholder="Enter your name" required>
							<template #prefix>
								<i class="si-user"></i>
							</template>
							<template #required> Required </template>
						</Input>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<Button type="submit">Submit Accordion</Button>
		</FormInput>

		<div class="bg-white p-4">
			<div v-for="(tabConfig, index) in tabsConfig" :key="index">
				<Tabs
					:default-value="tabConfig.defaultValue"
					:variant="tabConfig.variant"
				>
					<TabsList>
						<TabsTrigger
							v-for="(trigger, idx) in tabConfig.triggers"
							:key="idx"
							:value="trigger.value"
							:badge-count="trigger.badgeCount"
						>
							{{ trigger.label }}
						</TabsTrigger>
					</TabsList>
					<TabsContent
						v-for="(content, idx) in tabConfig.contents"
						:key="idx"
						:value="content.value"
						class="text-black"
					>
						<Card>
							<CardHeader>
								<CardTitle>{{ content.text }}</CardTitle>
								<CardDescription
									>Deploy your new project in one-click.</CardDescription
								>
							</CardHeader>
							<CardContent>
								Lorem ipsum dolor sit amet consectetur adipisicing elit.
								Cupiditate illum repellat et ipsam voluptatum aliquam aspernatur
								nostrum impedit dolores repudiandae, alias praesentium
								laudantium corporis eveniet eius consectetur nemo harum!
								Accusamus.
							</CardContent>
							<CardFooter class="flex justify-between px-6 pb-6">
								<Button> Cancel </Button>
								<Button>Deploy</Button>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>

		<Button @click="dataTableDialogOpened = true">Open Dialog</Button>

		<Dialog v-model:open="dataTableDialogOpened">
			<DialogContent class="text-neutral-100 text-center w-[400px]">
				<DataTable />
			</DialogContent>
		</Dialog>
		<DataTable />
		<DataTable :sticky-headers="false" :headers-text-wrap="false" />
		<Dropdown v-model="modelDropdownEmpty" class="w-full">
			<DropdownItem key="" value="">
				<span>value empty</span>
			</DropdownItem>
			<DropdownItem v-for="index in 10" :key="index" :value="index">
				<span>{{ index }}</span>
			</DropdownItem>
		</Dropdown>
		<SDataTable
			id="lectures_class_participant_list_table"
			data-cy="lectures-class-participant-list-table"
			:data="mockParticipants"
		>
			<SDataTableColumn field="nim">
				<template #header> NIM </template>
				<template #default="{ row }">
					<span>{{ row.id }}</span>
				</template>
			</SDataTableColumn>

			<SDataTableColumn field="nama">
				<template #header> name</template>
				<template #default="{ row }">
					<span>{{ row.nama }}</span>
				</template>
			</SDataTableColumn>

			<SDataTableColumn field="program_study">
				<template #header> study_program </template>
				<template #default="{ row }">
					<span>{{ row.prodi?.jenjang }} {{ row.prodi?.nama }}</span>
				</template>
			</SDataTableColumn>

			<SDataTableColumn field="generation">
				<template #header> generation </template>
				<template #default="{ row }">
					<Dropdown v-model="modelDropdownEmpty" class="w-full">
						<DropdownItem key="" value="">
							<span>value empty</span>
						</DropdownItem>
						<DropdownItem v-for="index in 10" :key="index" :value="index">
							<span>{{ index }}</span>
						</DropdownItem>
					</Dropdown>
				</template>
			</SDataTableColumn>
		</SDataTable>
		<div class="mt-8">
			<h2 class="mb-4 text-neutral-100 text-left text-2xl">Stepper Bang</h2>
			<Stepper />
		</div>

		<h1>CYPRESS</h1>
		<Input
			v-model="cyNumericFractionDigits"
			placeholder="Cypress Numeric max fraction digits"
			type="numeric"
			decimal
			:max-fraction-digits="2"
			data-cy="cypress-numeric-max-fraction-digits"
		/>
		<Input
			v-model="cyTextMaxLength"
			placeholder="Cypress Text max length"
			:max-length="10"
			data-cy="cypress-text-max-length"
		/>
	</div>
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
