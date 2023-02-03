<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { Ref } from 'vue'

interface BingoList {
  value: number
  selected: boolean
  isBingo: boolean
}

let numberList = ref<BingoList[]>([])
let isPlay = ref<boolean>(false)
let gameState = ref<number>(0)
const suffle = (): void => {
  if (!isPlay.value) {
    numberList.value.sort(() => Math.random() - 0.8)
    isPlay.value = true
  } else {
    let result = confirm('게임중입니다! 게임을 다시 시작하시겠습니까?')
    if (result) {

    }
  }
}
const init = (): void => {
  let number: BingoList[] =
    new Array(25)
      .fill({})
      .map((item, index) => {
        const obj: BingoList = { value: 0, selected: false, isBingo: false}
        obj.value = index + 1
        return obj
      })
  numberList.value = number
}
init()

let drawNumber = ref<number>(0)
let drawList = ref<number[]>([])
let drawIndexList = ref<number[]>([])

const bingoCount = ref<number>(0)
const bingoColumn = ref<number[]>([])
const bingoRow = ref<number[]>([])
const bingoDiagonal = ref<string[]>([])

watchEffect(() => {
  if (bingoCount.value >= 3) {
    alert('게임끝~')
  }
})

/**
 * 빙고가 됐을때 해당 값의 isBingo를 true로 바꿔주는 함수
 */
const bingoEffect = (flag: string, index: number = 0): void => {
  if (flag === 'col') {
    for (let i = 0; i < 5; i++)  {
      numberList.value[index + (i * 5)].isBingo = true
    }
  } else if (flag === 'row') {
    for (let i = 0; i < 5; i++)  {
      numberList.value[index + i].isBingo = true
    }
  } else if (flag === 'L') {
    for (let i = 0; i < 5; i++)  {
      numberList.value[i * 6].isBingo = true
    }
  } else {
    for (let i = 0; i < 5; i++)  {
      numberList.value[(i + 1) * 4].isBingo = true
    }

  }
}

/**
 * 빙고 확인 함수
 */
const bingoCheck = (): void => {
  drawIndexList.value.sort((a,b) => a-b)

  const columnCheck = (idx: number) => {
    let isBingo = true

    for (let i = 0; i < 5; i++)  {
      if (drawIndexList.value.indexOf(idx+(i * 5)) === -1) {
        isBingo = !isBingo
        break
      }
    }

    if (isBingo && bingoColumn.value.indexOf(idx) === -1 ) {
      bingoCount.value ++
      bingoColumn.value.push(idx)
      bingoEffect('col', idx)
    }
  }

  const rowCheck = (idx: number) => {
    let isBingo = true

    for (let i = 0; i < 5; i++)  {
      if (drawIndexList.value.indexOf(idx + i) === -1) {
        isBingo = !isBingo
        break
      }
    }

    if (isBingo && bingoRow.value.indexOf(idx) === -1 ) {
      bingoCount.value ++
      bingoRow.value.push(idx)
      bingoEffect('row', idx)
    }

  }
  const diagonal = (flag: string) => {
    let isBingo = true

    if (flag === 'L') {

      for (let i = 0; i < 5; i++)  {
        if (drawIndexList.value.indexOf(i * 6) === -1) {
          isBingo = !isBingo
          break
        }
      }

    } else {
      for (let i = 0; i < 5; i++)  {
        if (drawIndexList.value.indexOf((i + 1) * 4) === -1) {
          isBingo = !isBingo
          break
        }
      }
    }

    if (isBingo && bingoDiagonal.value.indexOf(flag) === -1 ) {
      bingoCount.value ++
      bingoDiagonal.value.push(flag)
      bingoEffect(flag)
    }
  }

  if (drawIndexList.value.length >= 5) {

    for(let i = 0; i < drawIndexList.value.length; i++) {

      if (i < 5 && drawIndexList.value.indexOf(i) !== -1) {
        columnCheck(i)
      }

      if (drawIndexList.value.indexOf(i * 5) !== -1) {
        rowCheck(i * 5)
      }

    }

    if (drawIndexList.value.indexOf(12) !== -1 && drawIndexList.value.indexOf(0) !== -1) {
      diagonal('L')
    }

    if (drawIndexList.value.indexOf(12) !== -1 && drawIndexList.value.indexOf(4) !== -1) {
      diagonal('R')
    }
  }
}

/**
 * 카드를 클릭 했을때 번호를 뽑는 함수
 */
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

  let index: number = 0
  numberList.value.map((item, i) => {
    if (item.value === drawNumber.value) {
      item.selected = true
      index = i
    }
  })
  drawIndexList.value.push(index)
  bingoCheck()

}
</script>

<template>
  <h1>빙고</h1>
  <div class="gameBox bingo">
    <div class="fireworks">
      <span class="firework1"></span>
      <span class="firework2"></span>
      <span class="firework3"></span>
      <span class="firework4"></span>
      <span class="firework5"></span>
    </div>

    <div class="drawArea">
      <Transition name="fade" mode="out-in">
        <template v-if="!isPlay">
          <h2>빙고 번호를 섞어 주세요!</h2>
        </template>
        <template v-else>
          <div>
            <h2 class="num">{{ drawNumber }}</h2>
            <div class="btn" @click="draw">번호 뽑기</div>
          </div>
        </template>
      </Transition>
    </div>

    <div class="bingoArea">
      <div class="top">
        <div class="btn"  @click="suffle">빙고 번호 섞기</div>
      </div>
      <div class="cardList">
        <transition-group>
          <template
            :key="`number-${card.value}`"
            v-for="card in numberList">
            <div :class="['card', { bingo: card.isBingo }]" >
              {{ card.value }}
              <div class="selected" :class="{ check: card.selected }"></div>
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