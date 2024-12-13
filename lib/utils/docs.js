import { parse } from 'vue-docgen-api'
// import Input from '../components/input/Input.vue'

export const parseComments = async (code) => {
  return await parse(code)
}
console.log('parseComments')

console.log((await parseComments('lib/components/input/index.ts')))
