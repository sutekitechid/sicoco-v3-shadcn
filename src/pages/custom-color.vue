<template>
  <div>
    <h1>Custom Color Page</h1>
    <p>This is a page for custom colors.</p>
  </div>
  <Input v-model="inputtedColor" placeholder="Enter a color" />
  <Button class="my-4">Applied Color</Button>
  <div class="flex gap-2">
    <div class="w-4 h-4 bg-primary-950"></div>
    <div class="w-4 h-4 bg-primary-900"></div>
    <div class="w-4 h-4 bg-primary-800"></div>
    <div class="w-4 h-4 bg-primary-700"></div>
    <div class="w-4 h-4 bg-primary-600"></div>
    <div class="w-4 h-4 bg-primary-default"></div>
    <div class="w-4 h-4 bg-primary-400"></div>
    <div class="w-4 h-4 bg-primary-300"></div>
    <div class="w-4 h-4 bg-primary-200"></div>
    <div class="w-4 h-4 bg-primary-100"></div>
    <div class="w-4 h-4 bg-primary-subtle"></div>
  </div>
</template>

<script>
import Input from '@/components/input/Input.vue'
import Button from '@/components/button/Button.vue'
import chroma from "chroma-js"
import { computed, ref, onMounted, watch } from 'vue'

export default {
  components: {
    Input,
    Button
  },
  setup() {
    const inputtedColor = ref('')
    const colorPrimary = ref('255 168 0')
    watch(inputtedColor, (newValue) => {
      if (newValue) {
        console.log(hex2RGB(newValue))
        colorPrimary.value = hex2RGB(newValue)
        const red = colorPrimary.value[0]
        const green = colorPrimary.value[1]
        const blue = colorPrimary.value[2]
        // generate dari terang → base → gelap
        const scale = chroma.scale(['#fff', inputtedColor.value]).mode('lab')

        console.log('scale', scale(1).hex(), scale(1).rgb())

        const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
        stops.forEach((stop, i) => {
          const t = (i + 1) / stops.length
          const c = scale(t).rgb()
          console.log(`color-primary-${stop}`, c)
          document.documentElement.style.setProperty(`--color-primary-${stop}`, c.join(" "))
        })
      }
    }, { immediate: true })

    function hex2RGB(hex) {
      const bigint = Number.parseInt(hex.slice(1), 16)
      const r = (bigint >> 16) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255
      return [r, g, b]
    }
    return {
      colorPrimary,
      inputtedColor
    }
  }
}
</script>
