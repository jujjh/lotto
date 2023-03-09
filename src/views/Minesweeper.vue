<script setup lang="ts">
import { ref, watchEffect } from 'vue'
interface Ground {
  isMine: boolean
  mineCount: number
  isPin: boolean
  isOpen: boolean
  isSafe: boolean
  nearMine: number[]
  ishint: boolean
}

interface Select {
  value: number
  text: string
  cellX: number
  cellY: number
  mine: number
}

let isPlay = ref<boolean>(false)
let isGameEnd = ref<boolean>(false)
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
let resultText = ref<string>('')

const getCoord = (index: number): number[] => {
  return [Math.floor(index / cellX) , index % cellX]
}

const getIndex = (y: number, x: number): number => {
  return y * cellY + x
}

watchEffect(() => {
  if (mines.value === 0) {
    console.log('지뢰 검증~')
    gameAnd()
  }
})

let firstIndex: number = 0
let firstCoord: number[] = []
let firstAround: number[] = []
let time = ref<string>('000')

let mineList: number[] = []
let pinList: number[] =  []
let board = ref<Ground[][]>([])

const showReStar = (): void => {
  setTimeout(() => {
    isGameEnd.value = true
  }, 2000)
}

const minesOpen = (): void => {
  mineList.forEach(index => {
    let [y, x] = getCoord(index)
    board.value[y][x].isOpen = true
  })
  showReStar()
}

const isClear = (): void => {
  let mineFind: boolean[] = []
  mineList.forEach(index => {
    let [y, x] = getCoord(index)
    mineFind.push(board.value[y][x].isPin ? true : false)
  })

  if (mineFind.indexOf(false) === -1) {
    resultText.value = '🎉Clear!🎉'
    showReStar()

  } else {
    minesOpen()
  }
}


let interval: number | undefined
const timeStart = (): void => {
  isPlay.value = true

  let timeNum: number = 0
  interval = setInterval(() => {
    timeNum++
    time.value = timeNum.toString().padStart(3,0)
  }, 1000)
}

const gameAnd = (): void => {
  clearInterval(interval)
  isPlay.value = false

  if (mines.value !== 0) {
    minesOpen()
  } else {
    isClear()
  }
}

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
      let arr = new Array(cellX).fill(0).map(itemX => {
        return {
            isMine: false,
            mineCount: 0,
            isPin: false,
            isOpen: false,
            isSafe: false,
            nearMine: [],
            ishint: false
          }
      })
      return arr
    })
  mines.value = select[level.value].mine
  cellStyle.value =
    `grid-template-columns: repeat(${cellX}, 1fr);
    grid-template-rows: repeat(${cellY}, 1fr);`
}
init()

/**
 * 셀 존재 여부를 체크하는 함수들
 * @param y
 * @param x
 */
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
    let [y, x] = getCoord(index)

    if (topLeftCheck(y, x)) {
      board.value[y - 1][x - 1].mineCount ++
      board.value[y - 1][x - 1].nearMine.push(getIndex(y, x))
    }

    if (topCheck(y, x)) {
      board.value[y - 1][x].mineCount ++
      board.value[y - 1][x].nearMine.push(getIndex(y, x))
    }

    if (topRightCheck(y, x)) {
      board.value[y - 1][x + 1].mineCount ++
      board.value[y - 1][x + 1].nearMine.push(getIndex(y, x))
    }

    if (leftCheck(y, x)) {
      board.value[y][x - 1].mineCount ++
      board.value[y][x - 1].nearMine.push(getIndex(y, x))
    }

    if (rightCheck(y, x)) {
      board.value[y][x + 1].mineCount ++
      board.value[y][x + 1].nearMine.push(getIndex(y, x))
    }

    if (bottomLeftCheck(y, x)) {
      board.value[y + 1][x - 1].mineCount ++
      board.value[y + 1][x - 1].nearMine.push(getIndex(y, x))
    }

    if (bottomCheck(y, x)) {
      board.value[y + 1][x].mineCount ++
      board.value[y + 1][x].nearMine.push(getIndex(y, x))
    }

    if (bottomRightCheck(y, x)) {
      board.value[y + 1][x + 1].mineCount ++
      board.value[y + 1][x + 1].nearMine.push(getIndex(y, x))
    }

  })

}

const setMine = (): void => {
  mineList.sort((a, b) => a - b).map(index => {
    const [y, x] = getCoord(index)
    board.value[y][x].isMine = true
  })

  setMinCount()
  cellCheck(firstCoord[0], firstCoord[1])
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

const nearCheck = (y: number, x: number): number[] => {
  let nearList = []
  nearList.push(topLeftCheck(y, x) ? getIndex(y - 1, x - 1) : -1)
  nearList.push(topCheck(y, x) ? getIndex(y - 1, x) : -1)
  nearList.push(topRightCheck(y, x) ? getIndex(y - 1, x + 1) : -1)
  nearList.push(leftCheck(y, x) ? getIndex(y, x - 1) : -1)
  nearList.push(rightCheck(y, x) ? getIndex(y, x + 1) : -1)
  nearList.push(bottomLeftCheck(y, x) ? getIndex(y + 1, x - 1) : -1)
  nearList.push(bottomCheck(y, x) ? getIndex(y + 1, x) : -1)
  nearList.push(bottomRightCheck(y, x) ? getIndex(y + 1, x + 1) : -1)
  return nearList
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
    pinList = []
  }

  nearCheck(y, x).forEach(index => {
    if (index > -1) {
      const [y, x] = getCoord(index)
      safeList.push(!board.value[y][x].isMine ? [y, x] : [-1, -1])
    }
  })

  if ([...safeList].join('').includes('-1')) {
    return
  }

  safeList.forEach(cell => isNearMine(cell[0], cell[1]))
}


/**
 * Cell에 핀 또는 지뢰가 없을때 cellOpen 실행.
 * 지뢰가 있을때 게임 종료
 * @param {y} cell 좌표 y값
 * @param {x} cell 좌표 x값
 */
const cellCheck = (y: number, x: number): void => {
  if (!board.value[y][x].isPin && !board.value[y][x].isMine) {
    cellOpen(y, x)
  } else if (board.value[y][x].isMine) {
    resultText.value = '💣펑! 💀💀💀 '
    gameAnd()
  }
}

/**
 * 배치된 지뢰가 없을때 지뢰 배치 후 cell 오픈
 * @param {y} cell 좌표 y값
 * @param {x} cell 좌표 x값
 */
const cellOpen = (y: number, x: number): void => {
  if (mineList.length === 0) {
    firstIndex = getIndex(y, x)
    firstCoord = [y, x]
    firstAround = new Array(9).fill(0).map((item, index) => {
      let nearX = (index % 3) - 1
      let nearY = (Math.floor(index / 3)) - 1
      return firstIndex + (cellX * nearY) + nearX
    })

    setRondomMine()
    time.value = '000'
    timeStart()

  } else {
    console.log('click ---- > ', y, x)
    isNearMine(y, x)
  }
}


const gameStart = (): void => {
  isGameEnd.value = false
  init()
}

const setPin = (y: number, x: number): void => {
  if (board.value[y][x].isOpen) {
    return
  }

  if (board.value[y][x].isPin) {
    board.value[y][x].isPin = false
    mines.value++
  } else {
    board.value[y][x].isPin = true
    mines.value--
  }
}

let hintList: number[] = []
/**
 * 마우스 좌/우 동시 클릭시 힌트 체크 영역 표시
 * @param {y} cell 좌표 y값
 * @param {x} cell 좌표 x값
 */
const getHint = (y: number, x: number): void => {
  hintList = []
  if (!board.value[y][x].isOpen) {
    cellCheck(y, x)
    return
  }

  let mineCount: number = board.value[y][x].mineCount
  let nearMine: number[] = board.value[y][x].nearMine
  let nearPin: number[] = []

  if (mineCount === 0) {
    return
  }

  nearCheck(y,x).forEach(index => {
    if (index > 0) {
      const [cellY,cellX] = getCoord(index)
      if (!board.value[cellY][cellX].isPin && !board.value[cellY][cellX].isOpen) {
        board.value[cellY][cellX].ishint = true
        hintList.push(index)

      } else if (board.value[cellY][cellX].isPin) {
        nearPin.push(index)
      }
    }
  })

  nearPin.sort((a, b) => a - b)
  nearMine.sort((a, b) => a - b)

  let isNearOpen: boolean = true
  if (nearPin.length === nearMine.length) {
    for (let i = 0; i < nearPin.length; i++) {
      if (nearPin[i] !== nearMine[i]) {
        const [mineY, mineX] = getCoord(nearMine[i])
        isNearOpen = false
        cellOpen(mineY, mineX)
        break
      }
    }

    if (isNearOpen) {
      hintList.forEach(index => {
        const [y, x] = getCoord(index)
        cellOpen(y, x)
      })
    }
  }
}

let hint: boolean = false
const cellMouseDown = (event: any, y: number, x: number): void => {
  const left = event.button === 0
  const right = event.button === 2
  const letftRight = event.buttons === 3
  if (left && letftRight || right && letftRight) {
    hint = true
    if (board.value[y][x].isOpen) {
      getHint(y,x)

    } else {
      cellCheck(y, x)
    }

  } else {
    hint = false
  }
}

const cellMouseUp = (event: any, y: number, x: number): void => {
  if (hint) {
    hintList.forEach(index => {
      const [hintY, hintX] = getCoord(index)
      board.value[hintY][hintX].ishint = false
    })

  } else if (event.button === 0 && event.buttons === 0) {
    cellCheck(y, x)

  } else if (event.button === 2 && event.buttons === 0) {
    setPin(y, x)
  }
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
      ⏱ {{ time }}
      </h2>
    </div>

    <div class="ground">
      <div class="reStart" v-if="isGameEnd">
        <h1>{{ resultText }}</h1>
        <div class="btn" @click="gameStart()">
          <font-awesome-icon icon="fa-solid fa-rotate-right" />
          재시작
        </div>
      </div>

      <div class="gridBox" :style="cellStyle" >
        <template v-for="(cellY, indexY) in board">
          <template v-for="(cell, indexX) in cellY" :key="`box-${indexX}`">

            <div
              :class="['grid', `level-${level}`, {'open': cell.isOpen}]"
              @mousedown.prevent="cellMouseDown($event, indexY, indexX)"
              @mouseup.prevent="cellMouseUp($event, indexY, indexX)"
              @contextmenu.prevent
              >
                <div
                  class="hint"
                  v-if="cell.ishint && !cell.isOpen">
                </div>

                <span
                  :class="['count', `count-${cell.mineCount}`]"
                  v-if="cell.mineCount > 0 && !cell.isMine && cell.isOpen">
                  {{ cell.mineCount }}
                </span>

                <span
                  :class="['mine', {'mineOpen': cell.isOpen}]"
                  v-if="cell.isMine && !cell.isPin">
                  💣
                </span>
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