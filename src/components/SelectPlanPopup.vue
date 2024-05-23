<template>
  <div class="overlay">
    <div class="popup-content">
      <div class="innerHeader">
        <h3 class="title">요금제선택</h3>
        <span @click="$emit('closePopup')" class="material-symbols-outlined close-button">
          cancel
        </span>
      </div>

      <div class="scroll-content">
        <div style="height: 30px"></div>

        <div class="types">
          <div
            class="button"
            v-for="(item, index) in types"
            :key="index"
            :class="{ selected: selectedType === item.cd }"
            @click="changeType(item.cd)"
          >
            {{ item.label }}
          </div>
        </div>
        <div style="height: 30px"></div>

        <div class="searchRow">
          <input
            type="text"
            id="search"
            name="password"
            placeholder="검색할 요금제명을 입력해주세요"
          />

          <button class="searchButton">
            <span class="material-symbols-outlined"> search </span>검색
          </button>
        </div>

        <div style="height: 300px"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedType = ref('PO')

const props = defineProps(['selectedType', 'carrierCode', 'mvnoCode'])

console.log(props.selectedType)
console.log(props.carrierCode)
console.log(props.mvnoCode)

const types = ref([
  { cd: 'PO', label: '후불' },
  { cd: 'PR', label: '선불' }
])

function changeType(cd) {
  selectedType.value = cd
}
</script>

<style scoped>
.searchButton {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
}
.searchButton .material-symbols-outlined {
  font-size: 25px;
}

.searchRow {
  display: flex;
  gap: 20px;
  align-items: center;
  box-sizing: border-box;
}

input {
  height: 50px;
  max-width: 400px;
}

button {
  max-width: 100px;
  height: 50px;
}

.overlay {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  z-index: 1100;
  background-color: rgba(0, 0, 0, 0.552);
  padding: 20px;
}

.popup-content {
  background-color: white;
  border-radius: 8px;
  height: 100%;
  width: 100%;
  /* display: flex; */
  overflow: auto;
}

.innerHeader {
  position: sticky;
  top: 0;
  height: 60px;
  padding: 0 20px;
  background-color: #ffffff;
  align-items: center;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bottom shadow */
}

.innerHeader .material-symbols-outlined {
  font-size: 30px;
}

.scroll-content {
  padding: 0 20px;
}

.types {
  display: flex; /* Display the carrier buttons in a row */
  gap: 20px;
  flex-flow: wrap;
}

.button {
  min-height: 50px;
  min-width: 140px;
}

@media (max-width: 767px) {
  .button {
    flex: 1 0 calc(50% - 20px); /* each item takes half of the container width with a gap of 20px */
    max-width: calc(50% - 10px); /* ensures items don't exceed half of the container width */
  }
}
</style>
