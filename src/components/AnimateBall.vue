<script setup lang="ts">
import { ref, defineProps } from 'vue'
import type { Ref } from 'vue'

interface Props {
  num: number
}

const props = defineProps<Props>()

let number: Ref<number> = ref(0)
number.value = props.num

let lottoInterval = setInterval((): void => {
  number.value = number.value === 45 ? 1 : number.value + 1
}, 50)

setTimeout((): void => {
  clearInterval(lottoInterval)
}, 3000)

const colorCheck = (num: number): string  => {
  if (num < 11) {
    return 'ball_type1'
  } else if (num < 21) {
    return 'ball_type2'
  } else if (num < 31) {
    return 'ball_type3'
  } else if (num < 41) {
    return 'ball_type4'
  } else {
    return 'ball_type5'
  }
}

</script>

<template>

  <span :class="['ball', colorCheck(number)]">
    {{ number }}
  </span>

</template>