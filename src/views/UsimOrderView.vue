<template>
  <div class="usim_order_container">
    <button style="" @click="openPopup" class="order_button">
      <span class="material-symbols-outlined"> local_shipping </span>
      <span> 유심 주문하기 </span>
    </button>
    <div></div>
    <button style="" @click="openAddressPopup" class="order_button">
      <span class="material-symbols-outlined"> local_shipping </span>
      <span> Open address </span>
    </button>
  </div>
  <GlobalPopupWithOverlay ref="popupRef">
    <OrderUsimPopup v-if="orderNewPopupOpen" @closePopup="closePopup" />
  </GlobalPopupWithOverlay>
</template>

<script setup>
import OrderUsimPopup from '@/components/OrderUsimPopup.vue'
import { ref } from 'vue'

const popupRef = ref(null)
const orderNewPopupOpen = ref(false)
const closePopup = () => {
  popupRef.value.closePopup()
}
function openPopup() {
  orderNewPopupOpen.value = true
  popupRef.value.showPopup()
}
</script>

<style scoped>
.usim_order_container {
  padding: 0 20px;
  display: flex;
  flex-flow: column;
  align-items: center;
}

.order_button {
  align-self: flex-start;
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
