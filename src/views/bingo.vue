<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

interface BingoList {
  value: number
  selected: boolean
  isBingo: boolean
}

let COLS: number = 6
let TOTAL_COUNT: number = Math.pow(COLS,2)

let COL: string = 'col'
let ROW: string = 'row'
let LEFT: string = 'L'
let RIGHT: string = 'R'

let cardSize = ref({
  width: `calc((100% - (${(COLS - 1) * 5}px))  / ${COLS})`,
  height: `calc((100% - (${(COLS - 1) * 5}px))  / ${COLS})`,
})

let numberList = ref<BingoList[]>([])
let isPlay = ref<boolean>(false)
let isGameEnd = ref<boolean>(false)

let drawNumber = ref<number>(0)
let drawList = ref<number[]>([])
let drawIndexList = ref<number[]>([])

const bingoCount = ref<number>(0)
const bingoColumn = ref<number[]>([])
const bingoRow = ref<number[]>([])
const bingoDiagonal = ref<string[]>([])

watchEffect(() => {
  if (bingoCount.value >= 4) {
    setTimeout(() => {
      isGameEnd.value = true
    }, 300)
  }
})

const shuffleCheck = () => {
  let before = numberList.value
  let after = [...numberList.value].sort(() => Math.random() - 0.5)

  for (let i = 0; i < TOTAL_COUNT; i++) {
    if (before[i].value === after[i].value) {
      if (i === 0) {
        after.push(after[i])
        after.splice(i, 1)
        i--

      } else {
        after.splice(i - 1, 2, after[i], after[i - 1])
      }
    }
  }

  numberList.value = after
}

const shuffle = (): void => {
  if (!isPlay.value) {
    shuffleCheck()
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        shuffleCheck()
      }, (i + 1) * 500)
    }

    isPlay.value = true
  } else {
    let result = confirm('게임중입니다! 게임을 다시 시작하시겠습니까?')
    if (result) {
      isPlay.value = false
      init()
      shuffle()
    }
  }
}

/**
 * 빙고가 됐을때 해당 값의 isBingo를 true로 바꿔주는 함수
 */
const bingoEffect = (flag: string, index: number = 0): void => {
  if (flag === COL) {
    for (let i = 0; i < COLS; i++) {
      numberList.value[index + (i * COLS)].isBingo = true
    }

  } else if (flag === ROW) {
    for (let i = 0; i < COLS; i++) {
      numberList.value[index + i].isBingo = true
    }

  } else if (flag === LEFT) {
    for (let i = 0; i < COLS; i++) {
      numberList.value[i * (COLS + 1)].isBingo = true
    }

  } else {
    for (let i = 0; i < COLS; i++) {
      numberList.value[(i + 1) * (COLS - 1)].isBingo = true
    }

  }
}

/**
 * 세로 빙고가 맞는지 검증하는 함수
 */
const columnValidation = (idx: number): void => {
  let isBingo: boolean = true

  for (let i = 0; i < COLS; i++) {
    if (drawIndexList.value.indexOf(idx+(i * COLS)) === -1) {
      isBingo = !isBingo
      break
    }
  }

  if (isBingo && bingoColumn.value.indexOf(idx) === -1) {
    bingoCount.value ++
    bingoColumn.value.push(idx)
    bingoEffect(COL, idx)
  }
}

/**
 * 가로 빙고가 맞는지 검증하는 함수
 */
const rowValidation = (idx: number): void => {
  let isBingo: boolean = true

  for (let i = 0; i < COLS; i++)  {
    if (drawIndexList.value.indexOf(idx + i) === -1) {
      isBingo = !isBingo
      break
    }
  }

  if (isBingo && bingoRow.value.indexOf(idx) === -1) {
    bingoCount.value ++
    bingoRow.value.push(idx)
    bingoEffect(ROW, idx)
  }
}

/**
 * 대각선 빙고가 맞는지 검증하는 함수
 */
const diagonalValidation = (flag: string): void => {
  let isBingo: boolean = true

  if (flag === LEFT) {
    for (let i = 0; i < COLS; i++) {
      if (drawIndexList.value.indexOf(i * (COLS + 1)) === -1) {
        isBingo = !isBingo
        break
      }
    }

  } else {
    for (let i = 0; i < COLS; i++)  {
      if (drawIndexList.value.indexOf((i + 1) * (COLS - 1)) === -1) {
        isBingo = !isBingo
        break
      }
    }
  }

  if (isBingo && bingoDiagonal.value.indexOf(flag) === -1) {
    bingoCount.value ++
    bingoDiagonal.value.push(flag)
    bingoEffect(flag)
  }
}


/**
 * 뽑힌 번호가 5개 이상일 때 1차 검증 후 상황에 맞게 검증함수로 넘겨주는 함수
 */
const bingoCheck = (): void => {
  drawIndexList.value.sort((a, b) => a - b)

  if (drawIndexList.value.length >= COLS) {
    for(let i = 0; i < drawIndexList.value.length; i++) {
      if (i < COLS && drawIndexList.value.indexOf(i) !== -1) {
        columnValidation(i)
      }

      if (drawIndexList.value.indexOf(i * COLS) !== -1) {
        rowValidation(i * COLS)
      }
    }

    if (drawIndexList.value.indexOf(COLS + 1) !== -1 && drawIndexList.value.indexOf(0) !== -1) {
      diagonalValidation(LEFT)
    }

    if (drawIndexList.value.indexOf(Math.floor((COLS * 2) - 2)) !== -1 && drawIndexList.value.indexOf((COLS - 1)) !== -1) {
      diagonalValidation(RIGHT)
    }

  }
}

/**
 * 빙고판에 X 표시
 */
const selectCheck = (): void => {
  drawList.value.push(drawNumber.value)
  let index: number = 0
  numberList.value.map((item, i) => {
    if (item.value === drawNumber.value) {
      item.selected = true
      index = i
    }
  })
  drawIndexList.value.push(index)
}

/**
 * 애니메이션 넘버
 */
const animateNumber = (n: number): void => {
  let time = TOTAL_COUNT * 30
  let interval = setInterval(() => {
    n++
    drawNumber.value = n % TOTAL_COUNT === 0 ? TOTAL_COUNT : n % TOTAL_COUNT
  }, time / (TOTAL_COUNT * 2))

  setTimeout(() => {
    clearInterval(interval)
    selectCheck()
    bingoCheck()
  }, time);
}

const cardClick = (): void => {
  let number: number = 0

  number = Math.floor(Math.random() * TOTAL_COUNT + 1)
  if (drawList.value.indexOf(number) === -1) {
    animateNumber(number)
    return
  }
  cardClick()
}

const init = (): void => {
  numberList.value = []
  drawNumber.value = 0
  drawList.value = []
  drawIndexList.value = []

  bingoCount.value = 0
  bingoColumn.value = []
  bingoRow.value = []
  bingoDiagonal.value = []

  let number: BingoList[] =
    new Array(TOTAL_COUNT)
      .fill({})
      .map((item, index) => {
        const obj: BingoList = { value: 0, selected: false, isBingo: false}
        obj.value = index + 1
        return obj
      })
  numberList.value = number
}
init()

const reStart = (): void => {
  isPlay.value = false
  isGameEnd.value = false
  init()
  shuffle()
}
</script>

<template>
  <h1>빙고</h1>
  <div class="gameBox bingo">

    <div class="reStart" v-if="isGameEnd">
      <h2>🎉게임 클리어</h2>
      <div class="btn" @click="reStart()">
        <font-awesome-icon icon="fa-solid fa-rotate-right" />
        다시 시작
      </div>
    </div>

    <!-- <BingoAnimateNumber /> -->

    <div class="drawArea">
      <Transition name="fade" mode="out-in">
        <template v-if="!isPlay">
          <h2>빙고 번호를 섞어 주세요!</h2>
        </template>
        <template v-else>
          <div>
            <h2 class="num">
              {{ drawNumber }}
            </h2>
            <div class="btn" @click="cardClick">번호 뽑기</div>
          </div>
        </template>
      </Transition>
    </div>

    <div class="bingoArea">
      <div class="top">
        <div :class="['btn', {disable : isPlay}]" @click="shuffle">빙고 번호 섞기</div>
      </div>
      <div class="cardList">
        <transition-group>
          <template
            :key="`number-${card.value}`"
            v-for="card in numberList">
            <div :class="['card', { bingo: card.isBingo }]" :style="cardSize">
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
  transition: opacity 0.5s 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.v-move {
  // @for $i from 0 through 24 {
  //   &:nth-child(#{$i}) {
  //     transition-delay: ($i * 0.02s);
  //   }
  // }
  transition: transform 0.4s;
}
</style>