<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import AnimateBall from '@/components/AnimateBall.vue'

let setCount: Ref<string> = ref('0')

const colorCheck = (num: number): string  => {
  // num = Number(num)
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


interface Ball {
  value: number
  animate: boolean
}
let selectedBalls: Ref<Array<Ball[]>> = ref([])
let loadingText: Ref<boolean[]> = ref([])

const endAnimation = () => {
  for (let i = 0; i < Number(setCount.value); i ++) {
    setTimeout(() => {
      for (let j = 0; j < 5; j ++) {
        setTimeout(() => {
          selectedBalls.value[i][j].animate = false
          if (j === 4){
            loadingText.value[i] = false
          }
        }, (j + 1) * 300)
      }
    }, (i + 1) * 2000)
  }
}

const selecter = (): void => {
  let numberList: Ball[] =
    Array(45)
      .fill({ value:0, animate:true })
      .map((item, index) => {
        let obj: Ball = {value:0, animate:true}
        obj.value = index + 1
        return obj
      })
      .sort(() => Math.random() - 0.5)
  selectedBalls.value.push([...numberList.splice(0,5).sort((a: Ball,b: Ball) => a.value-b.value)])
}

const loop = (n: number): void => {
  selectedBalls.value = []
  for (let i = 0; i < n; i++){
    selecter()
    loadingText.value.push(true)
  }
  endAnimation()
}

const start = (): void => {
  loadingText.value = []
  if (setCount.value === '0' ) {
    alert('생성받을 세트를 선택해 주세요')
    return
  }
  loop(Number(setCount.value))
}

</script>

<template>
  <h1>로또 번호 생성기</h1>
  <div class="gameBox">
    <div class="top">
      생성받을 세트:
      <select v-model="setCount" required>
        <option value="0" disabled selected>선택</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <div class="bt" @click="start()">
        번호 받기
      </div>
    </div>


    <div class="lottoBox">
      <template v-for="(set, setIndex) in selectedBalls" :key="`number-${setIndex}`">

        <div :class="['lottoBalls', { complete: !loadingText[setIndex] }]">

          <h3>{{ loadingText[setIndex] ?  '생성중..' : '생성완료' }}</h3>
          <template  v-for="(num, ballIndex) in set" :key="`number-${ballIndex}`">

            <span
              :class="['ball', colorCheck(num.value)]"
              v-if="!num.animate">
              {{ num.value }}
            </span>

            <AnimateBall :num="num.value" v-else />

          </template>
        </div>
      </template>
    </div>
  </div>

</template>

<style scoped lang="scss">
@import '@/assets/scss/lotto.scss';
</style>