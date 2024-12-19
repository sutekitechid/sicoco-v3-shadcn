<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import './assets/index.css'
import '../lib/assets/icomoon/style.css'
import Button from '@/components/button/Button.vue'
import Badge from '@/components/badge/Badge.vue'
import Skeleton from '@/components/skeleton/Skeleton.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownItem from '@/components/dropdown/DropdownItem.vue'
import Switch from '@/components/switch/Switch.vue'
import Input from '@/components/input/Input.vue'
import Checkbox from '@/components/checkbox/Checkbox.vue'
import CheckboxGroup from '@/components/checkbox/CheckboxGroup.vue'
import { FormInput } from '@/components/form-input'
import { Toaster, useToast } from '@/components/toast'
import { RadioGroupItem, RadioGroup } from '../lib/components/radio'
import Upload from '@/components/upload/Upload.vue'
import { Tooltip, TooltipContent } from '../lib/components/tooltip'
import { Dialog, DialogContent } from '@/components/dialog'
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
		variant: 'primary',
	},
	{
		model: true,
		disabled: false,
		label: 'Success',
		variant: 'success',
	},
	{
		model: true,
		disabled: false,
		label: 'Warning',
		variant: 'warning',
	},
	{
		model: true,
		disabled: false,
		label: 'Danger',
		variant: 'danger',
	},
	{
		model: true,
		disabled: false,
		label: 'Secondary',
		variant: 'secondary',
	},
	{
		model: true,
		disabled: false,
		label: 'Grey / Gray',
		variant: 'grey',
	},
])
const switchDisable = ref(false)
const checkboxOptions = [
	{ label: 'Option 1', value: 'option1' },
	{ label: 'Option 2', value: 'option2' },
	{ label: 'Option 3', value: 'option3' },
]
const selectedOptions = ref<string[]>([])
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

watch(
	selectedFiles,
	value => {
		console.log(value)
	},
	{ deep: true }
)
const dialogOpened = ref(false)

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
		],
		contents: [
			{ value: 'account', text: 'Make changes to your account here.' },
			{ value: 'password', text: 'Change your password here.' },
		],
	},
	{
		defaultValue: 'profile',
		variant: undefined,
		triggers: [
			{ value: 'profile', label: 'Profile', badgeCount: '2' },
			{ value: 'settings', label: 'Settings' },
		],
		contents: [
			{ value: 'profile', text: 'View and edit your profile here.' },
			{ value: 'settings', text: 'Manage your account settings here.' },
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
</script>

<template>
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
			<Badge variant="danger" size="medium" closeable>Danger</Badge>
			<Badge variant="warning" size="large" closeable>Warning</Badge>
			<Badge variant="purple" size="large" closeable>purple</Badge>
		</div>
		<HelloWorld msg="Vite + Vue" />
		<Skeleton class="h-[125px] w-[250px] rounded-none" />
		<div class="my-10">
			<div class="grid grid-cols-2 gap-2 my-10">
				<FormInput>
					<Dropdown
						v-model="modelDropdown"
						@typing="onSearch"
						searchable
						required
						class="w-full"
						:custom-validators="{ test: value => value === 'option1' }"
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
					<button type="submit" class="text-neutral-100">Submit ah</button>
				</FormInput>
				<div>
					<FormInput>
						<Dropdown v-model="modelDropdownTrigger">
							<template #trigger>
								<Button rounded variant="primary" size="sm" disabled
									>Open</Button
								>
							</template>
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
					@typing="onSearch"
					searchable
					multiple
					disabled
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
		<Input placeholder="Enter your name" size="lg" />

		<span class="text-neutral-100 flex">
			<Checkbox /> checkboxmaul {{ checkboxmaul }}
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
					v-model="selectedOptions"
					:label="option.label"
					:value="option.value"
					:key="option.value"
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
						v-model="selectedOptions"
						:label="option.label"
						:value="option.value"
						:key="option.value"
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
		<RadioGroup v-model="selectedRadio">
			<RadioGroupItem :value="{ id: 1 }">Option 1</RadioGroupItem>
			<RadioGroupItem value="option2" variant="success" disabled
				>Option 2</RadioGroupItem
			>
			<RadioGroupItem value="option3" variant="danger">Option 3</RadioGroupItem>
		</RadioGroup>
		<Toaster />
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
				<Upload
					v-model="selectedFiles"
					:required="true"
					:max-size="10"
					label="Lampirkan file"
					disabled
				>
					<template #required>
						<p>Required</p>
					</template>
					<template #maxSize>
						<p>Max size</p>
					</template>
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
					industry. Lorem Ipsum has been the industry's standard dummy text ever
					since the 1500s, when an unknown printer took a galley of type and
					scrambled it to make a type specimen book. It has survived not only
					five centuries, but also the leap into electronic typesetting,
					remaining essentially unchanged. It was popularised in the 1960s with
					the release of Letraset sheets containing Lorem Ipsum passages, and
					more recently with desktop publishing software like Aldus PageMaker
					including versions of Lorem Ipsum.
				</div></TooltipContent
			>
		</Tooltip>
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
						This blog post has been published. Team members will be able to edit
						this post and republish changes.
					</p>
					<div class="flex gap-4">
						<Button outlined @click="dialogOpened = false" class="w-full"
							>Batal</Button
						>
						<Button class="w-full">Confirm</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
		<Button @click="dialogOpened = true" outlined>Open Dialog</Button>

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

		<h1 class="text-grey-100 my-3">TextArea Example</h1>

		<FormInput>
			<Textarea
				v-model="inputValue"
				id="my-textarea"
				placeholder="Tulis sesuatu..."
				:required="true"
				:minlength="5"
				:rows="4"
				:cols="50"
			>
			</Textarea>
			<Textarea
				v-model="inputDisabledValue"
				id="my-textarea"
				placeholder="Tulis sesuatu..."
				:rows="4"
				:cols="50"
				:disabled="true"
			>
			</Textarea>
			<Button type="submit">Submit</Button>
		</FormInput>
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
