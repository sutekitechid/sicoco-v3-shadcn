<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import './assets/index.css'
import Button from '@/components/button/Button.vue';
import Input from '@/components/input/Input.vue';
import FormInput from '@/components/form-input';
import { watch } from 'vue';
import '@/assets/icomoon/style.css';

import { ref } from 'vue';
const name = ref('');

watch(name, (newVal) => {
  console.log(newVal);
})
</script>

<template>
  <div class="bg-white">
    <div class="flex">
      <a href="https://vite.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <div class="flex gap-4">
      <div class="bg-danger-100 h-64">asd</div>
      <FormInput>
        <div class="grid grid-cols-2 gap-4">
            <Input
              v-model="name"
              placeholder="Enter your name asda asdasd asdasd asdasd asda "
              name="name"
              required
            >
              <template #prefix>
                <i class="si-user text-danger-100"></i>
                <!-- <div class="text-danger-100">Prefix</div> -->
              </template>
              <template #suffix>
                <i class="si-user text-danger-100"></i>
                <!-- <div class="text-danger-100">Prefix</div> -->
              </template>
              <template #required>
                <div>Wajib diisi custom</div>
              </template>
            </Input>
            <Input
              v-model="name"
              placeholder="Enter your last name"
              name="name"
              required
              type="url"
            >
            </Input>
        </div>
        <Button rounded variant="success" type="submit">Submit</Button>
        <Button rounded variant="success">Shadcn Button</Button>
        <i class="si-alert-circle text-danger-100"></i>
      </FormInput>
      <!-- <Input
        placeholder="Enter your name"
      /> -->
    </div>
    <HelloWorld msg="Vite + Vue" />
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
