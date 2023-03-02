<script setup lang="ts">
import { ref, watchEffect } from 'vue'
interface Ground {
  isMine: boolean
  mineCount: number
  isPin: boolean
  isOpen: boolean
  isSafe: boolean
}

interface Select {
  value: number
  text: string
  cellX: number
  cellY: number
  mine: number
}

let level = ref<number>(0)
let cellX: number = 0
let cellY: number = 0
let totalCell: number = 0
const select: Select[] = [
  { value:0, text: '하', cellX: 9, cellY: 9, mine: 10 },
  { value:1, text: '중', cellX: 16, cellY: 16, mine: 40 },
  { value:2, text: '상', cellX: 30, cellY: 16, mine: 99 },
]

let mines = ref(-1)
let cellStyle = ref(`
  grid-template-columns: repeat(${select[level.value].cellX}, 1fr);
  grid-template-rows: repeat(${select[level.value].cellY}, 1fr);
`)

watchEffect(() => {
  if (mines.value === 0) {
    gameAnd()
  }
})

let firstIndex: number = 0
let firstCoord: number[] = []
let firstAround: number[] = []

let mineList: number[] = []
let pinList: number[] =  []

const getIndex = (y: number, x: number): number => {
  return y * cellY + x
}
const getCoord = (index: number): number[] => {
  const x = index % cellX
  const y = Math.floor(index / cellX)
  return [y, x]
}


let board = ref<Ground[][]>([])
const init = (): void => {
  firstIndex = 0
  firstCoord = []
  firstAround = []
  mineList = []
  pinList = []

  cellY = select[level.value].cellY
  cellX = select[level.value].cellX
  totalCell = cellY * cellX


  board.value =
    new Array(cellY)
    .fill([])
    .map(itemY => {
      return new Array(cellX).fill(0).map(itemX => {
        return {
            isMine: false,
            mineCount: 0,
            isPin: false,
            isOpen: false,
            isSafe: false
          }
      })
    })

  mines.value = select[level.value].mine
  cellStyle.value =
    `grid-template-columns: repeat(${cellX}, 1fr);
    grid-template-rows: repeat(${cellY}, 1fr);`
}
init()


const topLeftCheck = (y: number, x: number): boolean => {
  return y - 1 >= 0 && x - 1 >= 0 ? true : false
}
const topCheck = (y: number, x: number): boolean => {
  return y - 1 >= 0 ? true : false
}
const topRightCheck = (y: number, x: number): boolean => {
  return y - 1 >= 0 && x + 1 < cellX ? true : false
}
const leftCheck = (y: number, x: number): boolean => {
  return x - 1 >= 0 ? true : false
}
const rightCheck = (y: number, x: number): boolean => {
  return x + 1 < cellX ? true : false
}
const bottomLeftCheck = (y: number, x: number): boolean => {
  return y + 1 < cellY && x - 1 >= 0 ? true : false
}
const bottomCheck = (y: number, x: number): boolean => {
  return y + 1 < cellY ? true : false
}
const bottomRightCheck = (y: number, x: number): boolean => {
  return y + 1 < cellY && x + 1 < cellX ? true : false
}

const setMinCount = (): void => {
  mineList.sort((a, b) => a - b).forEach(index => {
    const [y, x] = getCoord(index)

    if (topLeftCheck(y, x)) {
      board.value[y - 1][x - 1].mineCount ++
    }

    if (topCheck(y, x)) {
      board.value[y - 1][x].mineCount ++
    }

    if (topRightCheck(y, x)) {
      board.value[y - 1][x + 1].mineCount ++
    }

    if (leftCheck(y, x)) {
      board.value[y][x - 1].mineCount ++
    }

    if (rightCheck(y, x)) {
      board.value[y][x + 1].mineCount ++
    }

    if (bottomLeftCheck(y, x)) {
      board.value[y + 1][x - 1].mineCount ++
    }

    if (bottomCheck(y, x)) {
      board.value[y + 1][x].mineCount ++
    }

    if (bottomRightCheck(y, x)) {
      board.value[y + 1][x + 1].mineCount ++
    }
  })
}

const setMine = (): void => {
  mineList.sort((a, b) => a - b).forEach(item => {
    const [y, x] = getCoord(item)
    board.value[y][x].isMine = true
  })

  setMinCount()
  isOpen(firstCoord[0], firstCoord[1])
}

const setRondomMine = (): void => {
  if (mineList.length >= select[level.value].mine) {
    setMine()
    return
  }

  let newMine = Math.floor(Math.random() * totalCell)

  if (mineList.indexOf(newMine) === -1 && firstAround.indexOf(newMine) === -1) {
    mineList.push(newMine)
  }

  setRondomMine()
}

const gameAnd = (): void => {
  console.log('지뢰 검증~')
  mineList.sort((a, b) => a - b)
  pinList.sort((a, b) => a - b)

  mineList.forEach((item, index) => {
    if (item === pinList[index]) {
      console.log('게임 클리어')
    } else {
      console.log('게임 클리어 실패')
    }
  })

}

const isNearMine = (y: number, x: number): void => {
  if (board.value[y][x].isSafe) {
    return
  }

  let safeList: number[][] = []
  board.value[y][x].isOpen = true
  board.value[y][x].isSafe = true

  // 핀이 꼽힌 셀이 오픈될때 처리
  if (board.value[y][x].isPin) {
    board.value[y][x].isPin = false
    mines.value++
    removePin(y, x)
  }

  if (topLeftCheck(y, x)) {
    safeList.push(
      !board.value[y - 1][x - 1].isMine ? [y - 1, x -1] : [-1, -1]
    )
  }

  if (topCheck(y, x)) {
    safeList.push(
      !board.value[y - 1][x].isMine ? [y - 1, x] : [-1, -1]
    )
  }

  if (topRightCheck(y, x)) {
    safeList.push(
      !board.value[y - 1][x + 1].isMine ? [y - 1, x] : [-1, -1]
    )
  }

  if (leftCheck(y, x)) {
    safeList.push(
      !board.value[y][x - 1].isMine ? [y, x - 1] : [-1, -1]
    )
  }

  if (rightCheck(y, x)) {
    safeList.push(
      !board.value[y][x + 1].isMine ? [y, x + 1] : [-1, -1]
    )
  }

  if (bottomLeftCheck(y, x)) {
    safeList.push(
      !board.value[y + 1][x - 1].isMine ? [y + 1, x - 1] : [-1, -1]
    )
  }

  if (bottomCheck(y, x)) {
    safeList.push(
      !board.value[y + 1][x].isMine ? [y + 1, x] : [-1, -1]
    )
  }

  if (bottomRightCheck(y, x)) {
    safeList.push(
      !board.value[y + 1][x + 1].isMine ? [y + 1, x + 1] : [-1, -1]
    )
  }

  if ([...safeList].join('').includes('-1')) {
    return
  }

  safeList.forEach(cell => isNearMine(cell[0], cell[1]))
}

const isOpen = (y: number, x: number): void => {
  if (board.value[y][x].isMine) {
    console.log('게임 종료')
  } else {
    // console.log('click ---- > ', y, x)
    isNearMine(y, x)
  }
}

const gameStart = (): void => {
  init()
}

const removePin = (y: number, x: number): void => {
  let idx = pinList.indexOf(getIndex(y, x))
  pinList.splice(idx,1)
}

const setPin = (y: number, x: number): void => {
  let pinIdx = getIndex(y, x)

  if (board.value[y][x].isPin) {
    board.value[y][x].isPin = false
    removePin(y, x)
  } else {

    pinList.push(pinIdx)
    board.value[y][x].isPin = true
    mines.value--
  }
}

const showHint = (y: number, x: number): void => {
  let nearMines: number = board.value[y][x].mineCount
  let nearPin: number = 0
  let nearPinList: number[] = []

  if (topLeftCheck(y, x)) {
    if (board.value[y - 1][x - 1].isPin) {
      nearPinList.push()
    }
  }

  if (topCheck(y, x)) {
    nearPin += board.value[y - 1][x].isPin ? 1 : 0
  }

  if (topRightCheck(y, x)) {
    nearPin += board.value[y - 1][x + 1].isPin ? 1 : 0
  }

  if (leftCheck(y, x)) {
    nearPin += board.value[y][x - 1].isPin ? 1 : 0
  }

  if (rightCheck(y, x)) {
    nearPin += board.value[y][x + 1].isPin ? 1 : 0
  }

  if (bottomLeftCheck(y, x)) {
    nearPin += board.value[y + 1][x - 1].isPin ? 1 : 0
  }

  if (bottomCheck(y, x)) {
    nearPin += board.value[y + 1][x].isPin ? 1 : 0
  }

  if (bottomRightCheck(y, x)) {
    nearPin += board.value[y + 1][x + 1].isPin ? 1 : 0
  }

  if (nearMines === nearPin) {
    console.log('힌트: 근처 오픈~')
  }
}

let mouseLeft = false
let mouseRight = false
const cellMouseDown = (event: any): void => {
  event.preventDefault()

  if (event.which === 1 || event.button === 0) {
    mouseLeft = true
  }

  if (event.which === 3 || event.button === 2) {
    mouseRight = true
  }
}

const cellMouseUp = (event: any, coord: number[]): void => {
  event.preventDefault()

  let [y, x] = coord

  if (mouseLeft && mouseRight) {
    if (board.value[y][x].mineCount !== 0) {
      showHint(y, x)
    }

    mouseLeft = false
    mouseRight = false
    return

  } else if (mouseLeft) {
    if (mineList.length === 0) {
      firstIndex = getIndex(coord[0], coord[1])
      firstCoord = coord
      firstAround = new Array(9).fill(0).map((item, index) => {
        let x = (index % 3) - 1
        let y = (Math.floor(index / 3)) - 1
        return firstIndex + (cellX * y) + x
      })
      setRondomMine()

    } else {
      isOpen(y, x)
    }

  } else {
    if (!board.value[y][x].isOpen) {
      setPin(y, x)
    }
  }

  mouseLeft = false
  mouseRight = false
}


</script>
<template>
  <h1>지뢰찾기</h1>

  <div class="gameBox">

    <div class="scoreZone">

      <div>
        <select v-model="level" @change="gameStart()">
          <option
            :value="option.value"
            :key="option.text"
            v-for="option in select">
              {{ option.text }}
          </option>
        </select>
      </div>
      <h2>💣 {{ mines }}</h2>
      <h2 class="time">
      ⏱ 000
      </h2>
    </div>

    <div class="ground">
      <div class="gridBox" :style="cellStyle" >
        <template v-for="(cellY, indexY) in board">
          <template v-for="(cell, indexX) in cellY" :key="`box-${indexX}`">

            <div
              :class="['grid', `level-${level}`, {'open': cell.isOpen}]"
              @mousedown.prevent="cellMouseDown($event)"
              @mouseup.prevent="cellMouseUp($event, [indexY, indexX])"
              >
                <!-- <i>{{cell.index}} [{{ indexY }}, {{ indexX }}]</i> -->

                <span
                  :class="['count', `count-${cell.mineCount}`]"
                  v-if="cell.mineCount > 0 && !cell.isMine && cell.isOpen">
                  {{ cell.mineCount }}
                </span>

                <!-- <span v-if="cell.isMine && !cell.isPin">💣</span> -->
                <span class="pin" v-if="cell.isPin">🚩</span>
            </div>

          </template>
        </template>

      </div>
    </div>


  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/minesweeper.scss";
</style>