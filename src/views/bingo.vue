<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'

interface BingoList {
  value: number
  selected: boolean
}
let numberList = ref<BingoList[]>([])
let isPlay = ref<boolean>(false)
let gameState = ref<number>(0)
const suffle = (): void => {
  numberList.value.sort(() => Math.random() - 0.8)
  isPlay.value = true
}
const init = (): void => {
  let number: BingoList[] =
    new Array(25)
      .fill({})
      .map((item, index) => {
        const obj: BingoList = { value: 0, selected: false }
        obj.value = index + 1
        return obj
      })
  numberList.value = number
}
init()

let drawNumber = ref<number>(0)
let drawList = ref<number[]>([])

const bingo = (): void => {
  let index: number = 0
  numberList.value.map((item, i) => {
    if (item.value === drawNumber.value) {
      item.selected = true
      index = i
    }
  })
}

const draw = (): void => {
  let number: number = 0
  const random = (): void => {
    number = Math.floor(Math.random() * 25 + 1)
    if (drawList.value.indexOf(number) === -1) {
      return
    }
    random()
  }
  random()


  drawNumber.value = number
  drawList.value.push(number)
  bingo()

}
</script>

<template>
  <h1>빙고</h1>
  <div class="gameBox">

    <div class="drawArea">
      <Transition name="fade" mode="out-in">
        <template v-if="!isPlay">
          <h2 class="num">빙고 번호를 섞어 주세요!</h2>
        </template>
        <template v-else>
          <div>
            <h2 class="num">{{ drawNumber }}</h2>
            <div class="btn" @click="draw">번호 뽑기</div>
          </div>
        </template>
      </Transition>
      <div>
        <template
          :key="`number-${number}`"
          v-for="number in drawList">
             {{ number }},
        </template>
      </div>
    </div>

    <div class="bingoArea">
      <div class="btn"  @click="suffle">빙고 번호 섞기</div>

      <div class="cardList">
        <transition-group>
          <template
            :key="`number-${card.value}`"
            v-for="card in numberList">
            <div class="card" >
              {{ card.value }}
              <div class="selected" v-if="card.selected">
              </div>
            </div>
          </template>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/bingo.scss';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.v-move {
  transition: transform 1s;
}
</style>