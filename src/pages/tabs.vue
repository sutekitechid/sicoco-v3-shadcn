<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-3">Default Variant</h3>
			<Tabs
				v-model="defaultTab"
				variant="default"
				data-cy="tabs-default"
				data-testid="tabs-default"
			>
				<TabsList>
					<TabsTrigger value="overview" data-cy="tab-overview" data-testid="tab-overview">
						Overview
					</TabsTrigger>
					<TabsTrigger value="activity" data-cy="tab-activity" data-testid="tab-activity">
						Activity
					</TabsTrigger>
					<TabsTrigger value="settings" disabled data-cy="tab-disabled" data-testid="tab-disabled">
						Settings (disabled)
					</TabsTrigger>
					<TabsTrigger value="members">Members</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<p class="p-4">Overview content - ringkasan singkat.</p>
				</TabsContent>
				<TabsContent value="activity">
					<p class="p-4">Activity content - daftar aktivitas terbaru.</p>
				</TabsContent>
				<TabsContent value="settings">
					<p class="p-4">Settings content (tidak akan pernah tampil karena disabled).</p>
				</TabsContent>
				<TabsContent value="members">
					<p class="p-4">Members content - daftar anggota.</p>
				</TabsContent>
			</Tabs>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Boxes Variant</h3>
			<Tabs
				v-model="boxesTab"
				variant="boxes"
				data-cy="tabs-boxes"
				data-testid="tabs-boxes"
			>
				<TabsList>
					<TabsTrigger value="account" badge-count="3">Account</TabsTrigger>
					<TabsTrigger value="password">Password</TabsTrigger>
					<TabsTrigger value="billing" disabled>Billing (disabled)</TabsTrigger>
					<TabsTrigger value="team" badge-count="5">Team</TabsTrigger>
				</TabsList>
				<TabsContent value="account">
					<div class="p-4 bg-white dark:bg-neutral-100 rounded-b-md">
						Make changes to your account here.
					</div>
				</TabsContent>
				<TabsContent value="password">
					<div class="p-4 bg-white dark:bg-neutral-100 rounded-b-md">
						Change your password here.
					</div>
				</TabsContent>
				<TabsContent value="billing">
					<div class="p-4 bg-white dark:bg-neutral-100 rounded-b-md">
						Billing (disabled).
					</div>
				</TabsContent>
				<TabsContent value="team">
					<div class="p-4 bg-white dark:bg-neutral-100 rounded-b-md">
						Manage your team here.
					</div>
				</TabsContent>
			</Tabs>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Disabled In The Middle</h3>
			<Tabs v-model="middleTab" variant="default">
				<TabsList>
					<TabsTrigger value="first">First</TabsTrigger>
					<TabsTrigger value="middle" disabled>Middle (disabled)</TabsTrigger>
					<TabsTrigger value="last">Last</TabsTrigger>
				</TabsList>
				<TabsContent value="first">
					<p class="p-4">First tab content.</p>
				</TabsContent>
				<TabsContent value="middle">
					<p class="p-4">Middle tab content (tidak akan pernah tampil).</p>
				</TabsContent>
				<TabsContent value="last">
					<p class="p-4">Last tab content.</p>
				</TabsContent>
			</Tabs>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs'

const defaultTab = ref('overview')
const boxesTab = ref('account')
const middleTab = ref('first')
</script>
