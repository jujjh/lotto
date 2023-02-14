<script setup lang="ts">
import { ref, watchEffect } from 'vue'

interface BingoList {
  value: number
  selected: boolean
}

const COLS: number = 4
const TOTAL_COUNT: number = COLS ** 2

const LEFT: string = 'L'
const RIGHT: string = 'R'

const cardSize = ref({
  width: `calc((100% - (${(COLS - 1) * 5}px))  / ${COLS})`,
  height: `calc((100% - (${(COLS - 1) * 5}px))  / ${COLS})`,
})

let isGameEnd = ref<boolean>(false)

let numberList = ref<BingoList[][]>([])
let drawNumber = ref<number>(0)
let drawList: number[] = []

let bingoCount = ref<number>(0)

watchEffect(() => {
  if (bingoCount.value >= 4) {
    setTimeout(() => {
      isGameEnd.value = true
    }, 300)
  }
})

const setNumberList = (arr: BingoList[]): void => {
  numberList.value = []
  for (let i = 0; i < 5; i++) {
    numberList.value.push(arr.splice(0,COLS))
  }
}

const shuffle = (array: BingoList[]): void => {
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


const createNumber = (): void => {
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

let rowBingo: number[] = []
let colBingo: number[] = []
let diagonalBingo: string[] = []
let rowSelectedArr: boolean[][] = []
let colSelectedArr: boolean[][] = []

const createSelectedArr = (): void => {
  for (let i = 0; i < COLS; i++) {
    let arr = new Array(COLS).fill(false)
    rowSelectedArr.push([...arr])
    colSelectedArr.push([...arr])
  }
}
createSelectedArr()


const bingoCheck = () => {
  for(let i = 0; i < COLS; i++) {
    if (rowSelectedArr[i].indexOf(false) === -1 && rowBingo.indexOf(i) === -1) {
      bingoCount.value++
      rowBingo.push(i)
    }
  }

  for(let i = 0; i < COLS; i++) {
    if (colSelectedArr[i].indexOf(false) === -1 && colBingo.indexOf(i) === -1) {
      bingoCount.value++
      colBingo.push(i)
    }
  }

  let right = true
  for(let i = 0; i < COLS; i++) {
    right = rowSelectedArr[i][COLS - 1 - i]
    if (!right) {
      break

    } else if (i === COLS - 1 && right && diagonalBingo.indexOf(RIGHT) === -1) {
      diagonalBingo.push(RIGHT)
      bingoCount.value++
    }
  }

  let left = true
  for(let i = 0; i < COLS; i++) {
    left = rowSelectedArr[i][i]
    if (!left) {
      break

    } else if (i === COLS - 1 && left && diagonalBingo.indexOf(LEFT) === -1) {
      diagonalBingo.push(LEFT)
      bingoCount.value++
    }
  }
}

const selectedValueChange = (y: number, x: number): void => {
  numberList.value[y][x].selected = true
  rowSelectedArr[y][x] = true
  colSelectedArr[x][y] = true
}

const bingoIndexCheck = (): void => {
  outerFor : for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (numberList.value[i][j].value === drawNumber.value) {
        selectedValueChange(i, j)
        bingoCheck()

        break outerFor
      }

    }
  }
}

const getDrawNumber = (): void => {
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

  bingoCount.value = 0

  rowBingo = []
  colBingo = []
  diagonalBingo = []
  rowSelectedArr = []
  colSelectedArr = []
}

const reStart = (): void => {
  isGameEnd.value = false

  init()
  createSelectedArr()
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