<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import type { Ref } from 'vue'

const emit = defineEmits(['done'])

interface Props {
  num: number
  setIndex: number
  ballIndex: number
}

const { num , setIndex, ballIndex } = defineProps<Props>()
let isAnimateBall = ref(true)
let number: Ref<number> = ref(0)
number.value = num

let lottoInterval = setInterval((): void => {
  number.value = number.value === 45 ? 1 : number.value + 1
}, 50)

setTimeout(() => {
  isAnimateBall.value = false
  clearInterval(lottoInterval)

  if( ballIndex === 5) {
    emit('done', setIndex)
  }

}, ((setIndex + 1) * 2000) + ((ballIndex) * 300))

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

  <span
    :class="['ball', colorCheck(number)]"
    v-if="isAnimateBall">
    {{ number }}
  </span>
  <span
    :class="['ball', colorCheck(num)]"
    v-else>
    {{ num }}
  </span>

</template>