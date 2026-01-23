<template>
  <div>
    <h1>Custom Color Page</h1>
    <p>This is a page for custom colors.</p>
  </div>
  <Input v-model="inputtedColor" placeholder="Enter a color" />
  <Button class="my-4">Applied Color</Button>
  <div class="flex gap-2">
    <div class="w-4 h-4 bg-primary-100"></div>
    <div class="w-4 h-4 bg-primary-90"></div>
    <div class="w-4 h-4 bg-primary-80"></div>
    <div class="w-4 h-4 bg-primary-70"></div>
    <div class="w-4 h-4 bg-primary-60"></div>
    <div class="w-4 h-4 bg-primary-50"></div>
    <div class="w-4 h-4 bg-primary-40"></div>
    <div class="w-4 h-4 bg-primary-30"></div>
    <div class="w-4 h-4 bg-primary-20"></div>
    <div class="w-4 h-4 bg-primary-10"></div>
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

        for (let i = 0; i < 10; i++) {
          const c = scale((i + 1) / 10).rgb()
          console.log(`color-primary-${(i+1)*10}`, c)
          document.documentElement.style.setProperty(`--color-primary-${(i+1)*10}`, c.join(" "))
        }
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
