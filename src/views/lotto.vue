<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import AnimateBall from '@/components/AnimateBall.vue'

let setCount: Ref<string> = ref('0')

let selectedBalls: Ref<Array<number[]>> = ref([])
let loadingText: Ref<boolean[]> = ref([])

const selecter = (): void => {
  let selectNumberList: number[] = []
  let numberList: Array<number> = new Array(45).fill(0).map((item, index) => item = index+1)


  let index = 0
  const numberValidation = () => {

    selectNumberList =
      [...numberList.sort(() => Math.random() - 0.5).splice(0,6).sort((a: number,b: number) => a-b)]

    let oddOrEven: string[] = []
    let sequenceSize = 0
    let sequence: boolean[] = []
    let numberArea: number[] = new Array(5).fill(0)

    selectNumberList.forEach((item, index) => {
      oddOrEven.push(item % 2 ? 'odd' : 'even')

      let numberAreaIndex = item.toString().length === 2 ?  Number(item.toString().substring(0,1)) : 0
      numberArea[numberAreaIndex]  += 1

      if (index === 1) {
        sequenceSize = item - selectNumberList[index-1]
      } else if (index > 1) {
        sequence.push(sequenceSize === item - selectNumberList[index-1] ? true : false)
      }
    })

    if (Math.max(...numberArea) >= 4 ||
      selectNumberList[0] > 30 || selectNumberList[5] < 15 ||
      [...new Set(oddOrEven)].length === 1 ||
      sequence.indexOf(false) === -1 ) {
      numberValidation()
    }
  }
  numberValidation()
  selectedBalls.value.push(selectNumberList)
}

const loop = (n: number): void => {
  for (let i = 0; i < n; i++){
    selecter()
    loadingText.value.push(true)
  }
}

const start = (): void => {
  loadingText.value = []
  if (setCount.value === '0' ) {
    alert('생성받을 세트를 선택해 주세요')
    return
  }

  selectedBalls.value = []
  setTimeout(() => {
    loop(Number(setCount.value))
  }, 10)

}

const animateBallDone = (index: number) => {
  loadingText.value[index] = false
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
        <div :class="['lottoBalls', { complete: !loadingText[setIndex] }]"  v-if="selectedBalls">
          <h3>{{ loadingText[setIndex] ?  '생성중..' : '생성완료' }}</h3>
          <template  v-for="(num, ballIndex) in set" :key="`number-${ballIndex}`">
            <AnimateBall :num="num" :setIndex="setIndex" :ballIndex="ballIndex" @update:done="animateBallDone" />
          </template>
        </div>
      </template>
    </div>
  </div>

</template>

<style scoped lang="scss">
@import '@/assets/scss/lotto.scss';
</style>