<script setup lang="ts">
import { ref } from 'vue'
interface Ground {
  mineCount: number
  isMine: boolean
  isPin: boolean
  isOpen: boolean
  isRepeat: boolean
}

const CELL = 9
const MINE = 10
const CELL_SIZE = ref(`
  grid-template-columns: repeat(${CELL}, 1fr);
  grid-template-rows: repeat(${CELL}, 1fr);
`)

let mineList: number[] = []
let groundList = ref<Ground[]>([])
groundList.value = new Array(CELL * CELL).fill({}).map(item => {
  return {isMine: false, mineCount: 0, isPin: false, isOpen: false, isRepeat: false }
})




const isNearMine = (index: number): void => {

  let mine: boolean[] = []

  let x = index % CELL
  let y = Math.floor(index / CELL)

  if (x !== 0 && x !== CELL - 1 && y !== 0 && y !== CELL -1) {
    console.log(x, y)
    mine.push(groundList.value[index - CELL - 1].isMine ? true : false)
    mine.push(groundList.value[index - CELL].isMine ? true : false)
    mine.push(groundList.value[index - CELL + 1].isMine ? true : false)
    mine.push(groundList.value[index - 1].isMine ? true : false)
    mine.push(groundList.value[index].isMine ? true : false)
    mine.push(groundList.value[index + 1].isMine ? true : false)
    mine.push(groundList.value[index + CELL - 1 ].isMine ? true : false)
    mine.push(groundList.value[index + CELL].isMine ? true : false)
    mine.push(groundList.value[index + CELL + 1 ].isMine ? true : false)

  }

  // console.log(index, mine)
  // if (mine.indexOf(true) !== -1) return
  groundList.value[index].isRepeat = true
  mine.forEach((item, i) => {
    if (!item) {
      let x = i % 3
      let y = Math.floor(i / 3)
      let idx = index - CELL - 1 + (x * 1) + (y * CELL)
      groundList.value[idx].isOpen = true

      if (groundList.value[idx].mineCount === 0 && !groundList.value[idx].isRepeat) {
        isNearMine(idx)
        console.log(idx, '빈공간')
      }
    }

  });
}

const groundOpen = (index: number): void => {
  if (groundList.value[index].isMine) {
    console.log('지뢰 클릭! 게임 종료~')

  } else {
    console.log('click--->', index)
    isNearMine(index)
  }
}


let openArray: number[][] = []
const topCheck = (index: number): boolean => Math.floor(index / CELL) !== 0
const leftCheck = (index: number): boolean => index % CELL !== 0
const rightCheck = (index: number): boolean => (index + 1) % CELL !== 0
const bottomCheck = (index: number): boolean => Math.floor(index / CELL) < (CELL - 1)
const isMine = (index: number): boolean => groundList.value[index].isMine

const cellValueCheck = (): void => {
  groundList.value.map((item, index) => {

    if (item.isMine) return

    // top
    if (topCheck(index) && isMine(index - CELL)) {
      item.mineCount ++
    }

    // top left
    if (topCheck(index) && leftCheck(index) && isMine(index - CELL - 1)) {
      item.mineCount ++
    }

    // top right
    if (topCheck(index) && rightCheck(index) && isMine(index - CELL + 1)) {
      item.mineCount ++
    }

    // left
    if (leftCheck(index) && isMine(index - 1) ) {
      item.mineCount ++
    }

    // right
    if (rightCheck(index) && isMine(index + 1)) {
      item.mineCount ++
    }

    // bottom
    if (bottomCheck(index) && isMine(index + CELL)) {
      item.mineCount ++
    }

    // bottom left
    if (bottomCheck(index) && leftCheck(index) && isMine(index + CELL - 1)) {
      item.mineCount ++
    }

    // bottom right
    if (bottomCheck(index) && rightCheck(index) && isMine(index + CELL + 1)) {
      item.mineCount ++
    }

    openArray[Math.floor(index / CELL)][index % CELL] = item.mineCount
    return item
  })

}

const groundInit = (): void => {
  let i = 0
  while (i < CELL) {
    let list = new Array(CELL).fill(0)
    openArray.push([...list])
    i++
  }
}



// 지뢰 생성시 클릭된 영역을 중심으로 3*3은 지뢰 생성 X
let isCreateMine: boolean = false
const createMine = (base = -1): void => {
  let list: number[]  =
    new Array(CELL ** 2)
      .fill(0)
      .map((item, index) => index + 1)
      .filter(item =>
        (item < base - (CELL + 1)) ||
        (base - (CELL - 1) < item) && (item < base - 1) ||
        (base + 1 < item) && (item < base + (CELL - 1)) ||
        (base + (CELL + 1) < item)
      )
      .sort(() => Math.random() - 0.5)
      .splice(0, 10)

  mineList = list

  console.log('지뢰 생성끝~')
  mineList.sort((a, b) => a - b)

  groundList.value.map((item, index) => {
    if (mineList.indexOf(index) !== -1) {
      groundList.value[index].isMine = true
    }
  })
  cellValueCheck()
  groundOpen(base)
}

const cellClick = (index: number): void => {
  if (!isCreateMine) {
    groundInit()
    createMine(index)
    isCreateMine = true

  } else {
    if (groundList.value[index].isPin) return
    groundOpen(index)
  }
}
const setPin = (index: number): void => {
  if (groundList.value[index].mineCount !== 0 ) return

  groundList.value[index].isPin = !groundList.value[index].isPin
}

</script>
<template>
  <h1>지뢰찾기</h1>

  <div class="gameBox">
    <div class="ground">
      <div class="gridBox" :style="CELL_SIZE">
        <div
          :class="['grid', {'open': cell.isOpen}]"
          :key="`box-${index}`"
          @click.left="cellClick(index)"
          @click.right.prevent="setPin(index)"
          v-for="(cell, index) in groundList" >
          <i>{{ index }}</i>

          <span
            :class="['count', `count-${cell.mineCount}`]"
            v-if="cell.mineCount > 0 && cell.isOpen">
            {{ cell.mineCount }}
          </span>

          <span v-if="cell.isMine && !cell.isPin">💣</span>
          <span class="pin" v-if="cell.isPin"><font-awesome-icon icon="fa-solid fa-map-pin" /></span>
        </div>
      </div>
    </div>

    <div class="scoreZone">
      <h2>지뢰 갯수 {{ MINE }}</h2>
    </div>

  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/minesweeper.scss";
</style>