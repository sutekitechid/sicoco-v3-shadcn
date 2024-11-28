export const generateRandomName = () => {
  return `input__${Math.random().toString(36).substring(7)}`;
}

export { default } from './BaseInput.vue'