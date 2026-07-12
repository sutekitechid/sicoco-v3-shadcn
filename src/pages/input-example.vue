<template>
	<div class="flex flex-col gap-8 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-3">Basic</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Penggunaan Field dengan label, description, dan Input standar.
			</p>
			<Field
				label="Nama Lengkap"
				description="Sesuai KTP"
				class="max-w-sm"
			>
				<Input
					v-model="basic"
					placeholder="Masukkan nama lengkap"
				/>
			</Field>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Required</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Tambahkan prop <code>:required="true"</code> untuk menampilkan
				asterisk merah pada label.
			</p>
			<Field
				label="Email"
				:required="true"
				description="Kami tidak akan pernah membagikan email Anda"
				class="max-w-sm"
			>
				<Input
					v-model="required"
					type="email"
					placeholder="nama@email.com"
				/>
			</Field>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Prefix Icon</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Gunakan slot <code>#prefix</code> untuk menambahkan icon di sebelah
				kiri input.
			</p>
			<Field
				label="Cari"
				description="Cari berdasarkan nama atau kata kunci"
				class="max-w-sm"
			>
				<Input
					v-model="withPrefix"
					placeholder="Ketik untuk mencari..."
				>
					<template #prefix>
						<i class="si-search text-neutral-500" />
					</template>
				</Input>
			</Field>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Suffix Icon</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Gunakan slot <code>#suffix</code> untuk menambahkan icon di sebelah
				kanan input.
			</p>
			<Field
				label="Username"
				description="Akan ditampilkan di profil publik Anda"
				class="max-w-sm"
			>
				<Input
					v-model="withSuffix"
					placeholder="@username"
				>
					<template #suffix>
						<i class="si-user text-neutral-500" />
					</template>
				</Input>
			</Field>

			<div class="mt-6 max-w-sm">
				<Field label="API Key">
					<Input
						v-model="apiKey"
						placeholder="sk-..."
					>
						<template #suffix>
							<i class="si-lock text-neutral-500" />
						</template>
					</Input>
				</Field>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Disabled</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Input dalam keadaan non-aktif; tidak bisa diubah dan terlihat
				berbeda (abu-abu).
			</p>
			<Field
				label="Nama"
				description="Field ini non-aktif"
				class="max-w-sm"
			>
				<Input
					v-model="disabled"
					disabled
				/>
			</Field>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Readonly</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Input hanya-baca; nilai tampil normal (tidak abu-abu) dan bisa
				di-select/copy, tapi tidak bisa diedit.
			</p>
			<Field
				label="Kode Referral"
				description="Dibuat otomatis oleh sistem dan tidak dapat diubah"
				class="max-w-sm"
			>
				<Input
					v-model="readonly"
					readonly
				>
					<template #suffix>
						<i class="si-info text-neutral-500" />
					</template>
				</Input>
			</Field>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Validation</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Klik Submit pada form kosong untuk memicu error. Pesan kustom
				menggunakan slot <code>#required</code> dan
				<code>#minLength</code>.
			</p>
			<FormInput
				class="max-w-sm flex flex-col"
				@submit.prevent
			>
				<Field
					label="Username"
					:required="true"
				>
					<Input
						v-model="formUsername"
						required
						placeholder="Minimal 3 karakter"
						:min-length="3"
					>
						<template #required>
							<p>Username wajib diisi</p>
						</template>
						<template #minLength>
							<p>Username minimal 3 karakter</p>
						</template>
					</Input>
				</Field>

				<Field
					label="Nomor Telepon"
					:required="true"
				>
					<Input
						v-model="formPhone"
						required
						type="number"
						placeholder="08xxxxxxxxxx"
					>
						<template #prefix>
							<i class="si-call text-neutral-500" />
						</template>
						<template #required>
							<p>Nomor telepon wajib diisi</p>
						</template>
					</Input>
				</Field>

				<Button type="submit">
					Submit
				</Button>
			</FormInput>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Hint</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Gunakan slot <code>#hint</code> untuk menampilkan teks bantuan di
				bawah input.
			</p>
			<Field
				label="API Key"
				description="Dapatkan dari dashboard penyedia Anda"
				class="max-w-sm"
			>
				<Input
					v-model="hintExample"
					placeholder="sk-..."
				>
					<template #prefix>
						<i class="si-lock text-neutral-500" />
					</template>
					<template #hint>
						<p>Simpan key ini di tempat yang aman.</p>
					</template>
				</Input>
			</Field>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Character Counter</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Set prop <code>show-count</code> untuk menampilkan counter
				"X / maxLength" di kanan-bawah. Counter otomatis mengikuti
				<code>maxLength</code> dan tampil sebaris dengan hint.
			</p>
			<div class="flex flex-col gap-6 max-w-sm">
				<Field
					label="Bio"
					description="Maksimal 100 karakter"
				>
					<Input
						v-model="bio"
						:max-length="100"
						show-count
						placeholder="Ceritakan tentang diri Anda..."
					/>
				</Field>

				<Field label="Tweet" :required="true">
					<Input
						v-model="tweet"
						:max-length="280"
						:min-length="10"
						show-count
						required
						placeholder="Apa yang sedang terjadi?"
					>
						<template #required>Tweet wajib diisi</template>
						<template #minLength>
							Tweet minimal 10 karakter Karakter dihitung mengikuti aturan Twitter/X asd asd asd asd
						</template>
						<template #hint>
							Karakter dihitung mengikuti aturan Twitter/X asd asd asd asd
						</template>
					</Input>
				</Field>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Custom Label Slot</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Slot <code>#label</code> memungkinkan JSX/HTML kompleks pada label
				(misal icon atau badge).
			</p>
			<Field class="max-w-sm">
				<template #label>
					<span class="text-sm font-medium text-main inline-flex items-center gap-1">
						<i class="si-info text-primary-default" />
						Label dengan icon
						<span class="text-danger-90">*</span>
					</span>
				</template>
				<Input
					v-model="customLabel"
					required
					placeholder="Input ini punya label kustom"
				/>
			</Field>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/input/Input.vue'
import Button from '@/components/button/Button.vue'
import FormInput from '@/components/form-input/FormInput.vue'
import { Field } from '@/components/field'

const basic = ref('')
const required = ref('')
const withPrefix = ref('')
const withSuffix = ref('')
const apiKey = ref('')
const disabled = ref('Tidak bisa diubah')
const readonly = ref('REF-2024-XK7Q')
const formUsername = ref('')
const formPhone = ref('')
const hintExample = ref('')
const customLabel = ref('')
const bio = ref('')
const tweet = ref('')
</script>
