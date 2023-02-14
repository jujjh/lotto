<script setup lang="ts">
import { ref, watchEffect } from 'vue'

interface BingoList {
  value: number
  selected: boolean
}

const COLS: number = 4
const TOTAL_COUNT: number = COLS ** 2

const COL: string = 'col'
const ROW: string = 'row'
const LEFT: string = 'L'
const RIGHT: string = 'R'

const cardSize = ref({
  width: `calc((100% - (${(COLS - 1) * 5}px))  / ${COLS})`,
  height: `calc((100% - (${(COLS - 1) * 5}px))  / ${COLS})`,
})

let isPlay = ref<boolean>(false)
let isGameEnd = ref<boolean>(false)

let numberList = ref<BingoList[][]>([])
let drawNumber = ref<number>(0)
let drawList: number[] = []
let drawIndexList: number[] = []

let bingoCount = ref<number>(0)
let bingoColumn: number[] = []
let bingoRow: number[] = []
let bingoDiagonal: string[] = []

watchEffect(() => {
  if (bingoCount.value >= 4) {
    setTimeout(() => {
      isGameEnd.value = true
    }, 300)
  }
})

const setNumberList = (arr: BingoList[]) => {
  numberList.value = []
  for (let i = 0; i < 5; i++) {
    numberList.value.push(arr.splice(0,COLS))
  }
}

const shuffle = (array: BingoList[]) => {
  const before = array
  let after = [...before].sort(() => Math.random() - 0.5)

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

  setNumberList(after)
}

const createNumber = () => {
  const creatArray =
    new Array(TOTAL_COUNT)
      .fill({})
      .map((item, index) => {
        const obj: BingoList = { value: 0, selected: false}
        obj.value = index + 1
        return obj
      })

  setNumberList([...creatArray])
  setTimeout(() => {
    shuffle(creatArray)
  }, 200)

}
createNumber()


/**
 * 세로 빙고가 맞는지 검증하는 함수
 */
const columnValidation = (idx: number): void => {
  let isBingo: boolean = true

  for (let i = 0; i < COLS; i++) {
    if (drawIndexList.indexOf(idx+(i * COLS)) === -1) {
      isBingo = !isBingo
      break
    }
  }

  if (isBingo && bingoColumn.indexOf(idx) === -1) {
    bingoCount.value ++
    bingoColumn.push(idx)
    // isBingoValueChange(COL, idx)
  }
}

/**
 * 가로 빙고가 맞는지 검증하는 함수
 */
const rowValidation = (idx: number): void => {
  let isBingo: boolean = true

  for (let i = 0; i < COLS; i++)  {
    if (drawIndexList.indexOf(idx + i) === -1) {
      isBingo = !isBingo
      break
    }
  }

  if (isBingo && bingoRow.indexOf(idx) === -1) {
    bingoCount.value ++
    bingoRow.push(idx)
    // isBingoValueChange(ROW, idx)
  }
}

/**
 * 대각선 빙고가 맞는지 검증하는 함수
 */
const diagonalValidation = (flag: string): void => {
  let isBingo: boolean = true
  if (flag === LEFT) {
    for (let i = 0; i < COLS; i++) {
      if (drawIndexList.indexOf(i * (COLS + 1)) === -1) {
        isBingo = !isBingo
        break
      }
    }

  } else {
    for (let i = 0; i < COLS; i++)  {
      if (drawIndexList.indexOf((i + 1) * (COLS - 1)) === -1) {
        isBingo = !isBingo
        break
      }
    }
  }

  if (isBingo && bingoDiagonal.indexOf(flag) === -1) {
    bingoCount.value ++
    bingoDiagonal.push(flag)
    // isBingoValueChange(flag)
  }
}

const bingoCheck = () => {
  drawIndexList.sort((a, b) => a - b)

  if (drawIndexList.length >= COLS) {
    for(let i = 0; i < drawIndexList.length; i++) {
      if (i < COLS && drawIndexList.indexOf(i) !== -1) {
        columnValidation(i)
      }

      if (drawIndexList.indexOf(i * COLS) !== -1) {
        rowValidation(i * COLS)
      }
    }

    if (drawIndexList.indexOf(COLS + 1) !== -1 && drawIndexList.indexOf(0) !== -1) {
      diagonalValidation(LEFT)
    }

    if (drawIndexList.indexOf(Math.floor((COLS * 2) - 2)) !== -1 && drawIndexList.indexOf((COLS - 1)) !== -1) {
      diagonalValidation(RIGHT)
    }
  }
}

const selectedValueChange = (y: number, x: number) => {
  numberList.value[y][x].selected = true
}

const bingoIndexCheck = () => {
  outerFor : for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (numberList.value[i][j].value === drawNumber.value) {
        selectedValueChange(i, j)
        drawIndexList.push((i * COLS) + j)
        bingoCheck()
        break outerFor
      }

    }
  }
}

const getDrawNumber = () => {
  let number: number = 0

  number = Math.floor(Math.random() * TOTAL_COUNT + 1)
  if (drawList.indexOf(number) === -1) {
    drawNumber.value = number
    drawList.push(number)
    bingoIndexCheck()
    return
  }
  getDrawNumber()
}

const init = (): void => {
  numberList.value = []
  drawNumber.value = 0
  drawList = []
  drawIndexList = []

  bingoCount.value = 0
  bingoColumn = []
  bingoRow = []
  bingoDiagonal = []
}
const reStart = (): void => {
  isGameEnd.value = false

  init()
  createNumber()
}

</script>

<template>
  <h1>빙고 이차원배열</h1>
  <div class="gameBox bingo">

    <div class="reStart" v-if="isGameEnd">
      <h2>🎉게임 클리어</h2>
      <div class="btn" @click="reStart()">
        <font-awesome-icon icon="fa-solid fa-rotate-right" />
        다시 시작
      </div>
    </div>

    <div class="drawArea">

      <h2 class="num">
        {{ drawNumber }}
      </h2>
      <div class="btn" @click="getDrawNumber">번호 뽑기</div>
    </div>

    <div class="bingoArea">

      <div class="cardList">
        <template
          :key="`cardIdx-${index}`"
          v-for="(row, index) in numberList">

          <TransitionGroup>
            <template
            :key="`cardIdx-${index2}`"
              v-for="(card, index2) in row">
              <div class="card" :style="cardSize">
                {{ card.value }}
                <div class="selected" :class="{ check: card.selected }"></div>
              </div>
            </template>
          </TransitionGroup>

        </template>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/bingo.scss';


.v-move {
  transition: transform 0.4s;
}
</style>