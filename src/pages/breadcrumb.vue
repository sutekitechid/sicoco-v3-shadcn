<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-3">4 Items</h3>
			<Breadcrumb data-cy="breadcrumb-4" data-testid="breadcrumb-4">
				<BreadcrumbItem to="/">
					<i class="si-home-fill text-primary-500 text-lg" />
				</BreadcrumbItem>
				<BreadcrumbItem to="/library">Library</BreadcrumbItem>
				<BreadcrumbItem to="/library/data">Data</BreadcrumbItem>
				<BreadcrumbItem>Detail</BreadcrumbItem>
			</Breadcrumb>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">&gt; 6 Items (auto ellipsis)</h3>
			<p class="text-sm text-neutral-500 mb-2">
				Ketika item lebih dari threshold (4 di desktop, 3 di mobile), item
				tengah akan otomatis ter-collapse menjadi ellipsis interaktif. Klik
				ellipsis untuk expand.
			</p>
			<Breadcrumb data-cy="breadcrumb-long" data-testid="breadcrumb-long">
				<BreadcrumbItem to="/">
					<i class="si-home-fill text-primary-500 text-lg" />
				</BreadcrumbItem>
				<BreadcrumbItem to="/akademik">Akademik</BreadcrumbItem>
				<BreadcrumbItem to="/akademik/persetujuan">Persetujuan KRS/KRSS</BreadcrumbItem>
				<BreadcrumbItem to="/akademik/persetujuan/detail">Detail Mahasiswa Bimbingan</BreadcrumbItem>
				<BreadcrumbItem to="/akademik/persetujuan/detail/biodata">Biodata</BreadcrumbItem>
				<BreadcrumbItem to="/akademik/persetujuan/detail/biodata/riwayat">Riwayat Pendidikan</BreadcrumbItem>
				<BreadcrumbItem>Curriculum Vitae</BreadcrumbItem>
			</Breadcrumb>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">With Icons + Disabled</h3>
			<Breadcrumb>
				<BreadcrumbItem to="/">
					<i class="si-home-fill text-primary-500 text-lg" />
				</BreadcrumbItem>
				<BreadcrumbItem to="/settings" disabled>
					<div class="flex gap-2 items-center">
						<i class="si-settings text-neutral-500 mr-1" />
						Settings
					</div>
				</BreadcrumbItem>
				<BreadcrumbItem>Profile</BreadcrumbItem>
			</Breadcrumb>
		</section>
	</div>
</template>

<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from '@/components/breadcrumb'
</script>
