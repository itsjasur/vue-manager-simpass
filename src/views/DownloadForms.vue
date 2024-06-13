<template>
  <div class="container">
    <div class="carriers">
      <div
        class="button"
        v-for="(item, index) in carriers"
        :key="index"
        :class="{ selected: selectedCarrierCd === item.cd }"
        @click="changeCarrier(item.cd)"
      >
        {{ item.label }}
      </div>
    </div>

    <div class="forms">
      <div class="card" v-for="(item, index) in forms" :key="index">
        <img :src="item.image_url" :alt="item.mvno_nm" width="100%" />
        <img class="logo" :src="logoFinder(item.carrier_cd)" :alt="item.carrier_nm" height="100%" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { CARRIERS } from '@/assets/constants'
import { ref } from 'vue'
import { logoFinder } from '../utils/logoFinder'

const carriers = ref(CARRIERS)
const selectedCarrierCd = ref('')

const forms = ref([])

function changeCarrier(cd) {
  selectedCarrierCd.value = cd
}
</script>

<style scoped>
.container {
  margin-top: 20px;
  padding: 0 15px;
  display: flex;
  flex-flow: column;
  gap: 40px;
}
.carriers {
  display: flex; /* Display the carrier buttons in a row */
  gap: 20px;
  flex-flow: wrap;
}
.button {
  min-height: 60px;
  min-width: 140px;
}

.card {
  width: 200px;
  padding: 50px 30px;
  box-sizing: border-box;
  font-size: 20px;
  position: relative;
}
</style>
