<template>
	<div>
		<Dropdown :model-value="undefined" align="end">
			<template #trigger>
				<Button outlined><i class="si-settings text-lg"></i></Button>
			</template>
			<div class="text-left overflow-hidden">
				<slot />
			</div>
		</Dropdown>
	</div>
</template>

<script lang="ts" setup>
import Dropdown from '../dropdown/Dropdown.vue'
import Button from '../button/Button.vue'
</script>
