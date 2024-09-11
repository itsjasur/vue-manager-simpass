<template>
  <div class="agreement-main">
    <div class="popup-content">
      <div class="fixed-header">
        <span class="header-title">{{ props.title }}</span>
        <span @click="$emit('closePopup')" class="material-symbols-outlined close-button"> cancel </span>
      </div>
      <TermsView :page="props.type" />
    </div>
  </div>
</template>

<script setup>
import TermsView from '@/views/TermsView.vue'

const emit = defineEmits(['closePopup'])

const props = defineProps({
  title: { type: String, default: '' },
  type: { type: String, default: 'privacy' },
})
</script>

<style scoped>
.agreement-main {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;

  -webkit-user-select: none;
  user-select: none;
}

.popup-content {
  background-color: white;
  border-radius: 8px;
  max-width: 800px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .agreement-main {
    padding: 0;
  }
  .popup-content {
    width: 100%;
    height: 100%;
    border-radius: 0px;
  }
}

.close-button {
  font-size: 30px;
  color: #737373;
}
</style>
