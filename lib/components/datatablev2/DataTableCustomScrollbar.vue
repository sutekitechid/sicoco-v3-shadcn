<template>
  <div ref="scrollbar" class="scrollbar z-[999] hidden">
    <div ref="thumb" class="thumb" @mousedown="startDrag"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  tableId: {
    type: String,
    required: true
  },
  dataLength: {
    type: Number,
    default: 0
  },
  scrollElement: {
    type: HTMLElement,
    required: true
  }
})

const scrollbar = ref(null)
const thumb = ref(null)

const headerHeight = computed(() => {
	const headerElement = document.querySelector(`#${props.tableId} thead`);
	return headerElement ? headerElement.offsetHeight : 0;
});

function getContentHeight() {
  return props.scrollElement.virtualWrapper.scrollHeight;
}
function getVisibleHeight() {
  return props.scrollElement.virtualWrapper.clientHeight;
}
function getThumbHeight() {
  const visibleHeight = getVisibleHeight();
	const contentHeight = getContentHeight();

	const thumbHeight = Math.min(Math.max((visibleHeight / contentHeight) * visibleHeight, 10), visibleHeight);
	return thumbHeight;
}

// ============================
// THUMB DRAG FUNCTIONALITY
// ============================
let isDragging = false;
let dragStartY = 0;
let thumbStartTop = 0;

function stopDrag() {
	isDragging = false;
	document.removeEventListener('mousemove', onDrag);
	document.removeEventListener('mouseup', stopDrag);
	document.removeEventListener('selectstart', preventDefault);
}

function startDrag(event) {
	isDragging = true;
	dragStartY = event.clientY;
	thumbStartTop = parseInt(thumb.value.style.top) || 0;
	
	document.addEventListener('mousemove', onDrag);
	document.addEventListener('mouseup', stopDrag);
	document.addEventListener('selectstart', preventDefault); // Prevent text selection
	
	event.preventDefault();
}

function onDrag(event) {
	if (!isDragging || !props.scrollElement) return;
	
	const deltaY = event.clientY - dragStartY;
	const newThumbTop = thumbStartTop + deltaY;
	
  const visibleHeight = getVisibleHeight();
  const contentHeight = getContentHeight();
  const thumbHeight = getThumbHeight();

	// Calculate bounds
	const maxThumbTop = visibleHeight - thumbHeight;
	const clampedThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));
	
	// Calculate scroll position based on thumb position
	const scrollRatio = clampedThumbTop / (visibleHeight - thumbHeight);
	const newScrollTop = scrollRatio * (contentHeight - visibleHeight);

	// Use virtualScroll.scrollToOffset for smooth scrolling
	props.scrollElement.scrollToOffset(newScrollTop);
	
	event.preventDefault();
}

function preventDefault(event) {
	event.preventDefault();
}

watch(() => props.dataLength, (newValue) => {
	if (newValue) {
		setTimeout(() => {
      props.scrollElement.addEventListener('scroll', updateThumbPosition);
			scrollbar.value.style.top = `${headerHeight.value}px`;
      updateScrollbarHeight();
      updateScrollbarVisibility();
			updateThumbHeight();
		}, 100)
	}
}, { immediate: true });

function updateThumbHeight() {
	thumb.value.style.height = `${getThumbHeight()}px`;
}

function updateScrollbarHeight() {
	scrollbar.value.style.height = `${getVisibleHeight()}px`;
}

function updateScrollbarVisibility() {
	if (getContentHeight() > getVisibleHeight()) {
		scrollbar.value.style.display = 'block';
	} else {
		scrollbar.value.style.display = 'none';
	}
}

function updateThumbPosition() {
	const scrollTop = props.scrollElement.virtualWrapper.scrollTop;
  const contentHeight = getContentHeight()
  const visibleHeight = getVisibleHeight()
	const thumbTop = (scrollTop / (contentHeight - visibleHeight)) * (visibleHeight - getThumbHeight());
	thumb.value.style.top = `${thumbTop}px`; // Offset by header height
}

defineExpose({
  updateThumbPosition
});
</script>

<style scoped>

.scrollbar {
  right: -8px;
  width: 8px;
	@apply bg-neutral-10 rounded-full h-full absolute;
}

.thumb {
  border-radius: 3px;
  transition: background-color 0.2s ease;
  user-select: none;
	@apply bg-neutral-50 w-full rounded-full cursor-pointer absolute top-0;
}

.thumb:hover {
	@apply bg-neutral-60;
}

.thumb:active {
	@apply bg-neutral-60;
}
</style>