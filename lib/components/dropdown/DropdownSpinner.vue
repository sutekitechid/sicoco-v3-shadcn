<template>
	<div>
		<div class="lds-ring w-full h-full">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
</template>
<style scoped>
.lds-ring,
.lds-ring div {
	box-sizing: border-box;
}
.lds-ring {
	display: inline-block;
	position: relative;
}
.lds-ring div {
	box-sizing: border-box;
	display: block;
	position: absolute;
	width: 100%;
	height: 100%;
	/* margin: 1px; */
	border: 1px solid;
	border-radius: 50%;
	animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
	border-color: rgba(var(--color-primary-100)) transparent transparent
		transparent;
}
.lds-ring div:nth-child(1) {
	animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
	animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
	animation-delay: -0.15s;
}
@keyframes lds-ring {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
