<template>
  <div class="container">
    <!-- <div class="typeButton">Postpaid</div> -->

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

    <div style="height: 20px"></div>

    <div class="carriers">
      <div
        class="button"
        v-for="(item, index) in carriers"
        :key="index"
        :class="{ selected: selectedCarrier === item.cd }"
        @click="changeCarrier(item.cd)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedType = ref('postpaid')
const selectedCarrier = ref('kt')

const types = ref([
  { cd: 'postpaid', label: '후불' },
  { cd: 'prepaid', label: '선불' }
])

const carriers = ref([
  { cd: '', label: '전체' },
  { cd: 'kt', label: 'KT' },
  { cd: 'skt', label: 'SKT' },
  { cd: 'lg', label: 'LG U+' }
])

function changeType(cd) {
  selectedType.value = cd
}

function changeCarrier(cd) {
  selectedCarrier.value = cd
}
</script>

<style scoped>
.container {
  margin: 20px;
  /* background-color: aquamarine; */
}

.types {
  display: flex; /* Display the carrier buttons in a row */
  gap: 20px;
}

.carriers {
  display: flex; /* Display the carrier buttons in a row */
  gap: 20px;
}

.button.selected {
  border-color: var(--main-color);
  color: var(--main-color);
}
.button {
  min-height: 45px;
  min-width: 120px;
  width: auto;
  padding: 5px 10px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1.5px solid #797979;
  color: #797979;
  text-align: center;
  align-content: center;
}
.button:hover {
  cursor: pointer;
}

.button:active {
  cursor: pointer;
  border-color: #bebebe;
  color: #bebebe;
}
</style>
