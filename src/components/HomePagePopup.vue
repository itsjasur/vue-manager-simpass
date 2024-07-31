<template>
  <div class="overlay">
    <div class="popup-content">
      <div class="innerHeader">
        <!-- <h3 class="title">HomePage Popup</h3> -->
        <div></div>
        <span @click="$emit('closePopup')" class="material-symbols-outlined close-button"> cancel </span>
      </div>

      <div v-if="contractStatus === 'P'" class="scrollable-content">
        <span class="text-content">
          현재, 아래 대리점과 자동거래승인이 되어 대리점과 거래계약서에 자필서명을 완료해 주시면 정상적으로 서비스를
          이용하실 수 있습니다.
        </span>

        <div v-for="(agent, index) in props.agentsInfo" :key="index" class="column-card">
          <img class="agent-logo" :src="agent.logo_img_url" alt="SP" />
          <div class="info-title">{{ agent.agent_nm }}</div>
        </div>

        <button @click="router.push('/business-partners')">대리점계약 서명하기</button>
        <div></div>
      </div>

      <div v-if="contractStatus === 'N'" class="scrollable-content">
        <span>
          <span class="text-content">현재 거래대리점이 존재하지 않습니다.</span>
          <span class="text-content">대리점과 거래계약이 되어야 정상적으로 서비스를 이용하실 수 있습니다. </span>
        </span>
        <button @click="router.push('/business-request')">대리점거래 요청하기</button>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const emits = defineEmits(['closePopup'])

const props = defineProps({
  contractStatus: { type: String, required: true },
  agentsInfo: { type: Array, required: true },
})

// converts base64 to Blob URL
onMounted(() => {
  document.addEventListener('keydown', keydownHandle)
})

//this handles keyboard actions
function keydownHandle(event) {
  if (event.key === 'Escape') {
    emits('closePopup')
    // popup.close()
  }
}

onUnmounted(() => {
  // popup.close()
  emits('closePopup')
  document.removeEventListener('keydown', keydownHandle)
})
</script>

<style scoped>
.overlay {
  display: flex;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  z-index: 1100;
  background-color: rgba(0, 0, 0, 0.552);
  padding: 20px;
}

.popup-content {
  background-color: white;
  border-radius: 8px;
  /* height: 100%; */
  width: 450px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /* background-color: #efefef; */
  position: relative;
}

.innerHeader {
  position: sticky;
  top: 0;
  height: 50px;
  padding: 0 20px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bottom shadow */
}

.close-button {
  font-size: 30px;
}

.scrollable-content {
  margin-top: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 0 20px;
  /* height: 100%; */

  text-align: center;

  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.text-content {
  font-size: 16px;
  font-weight: 500;
}

.column-card {
  width: 100%;
  /* height: 100px; */
  padding: 10px;
  box-sizing: border-box;
  background-color: #0000000c;
  border-radius: 5px;
  display: flex;
  flex-flow: wrap;

  align-items: center;
  justify-content: center;
  gap: 10px;

  font-size: 16px;
  font-weight: 600;
}

.agent-logo {
  height: 40px;
  width: 120px;
  background-color: #0000000b;
  border-radius: 30px;
  box-sizing: border-box;
  padding: 0 10px;
  object-fit: contain;
}

button {
  /* padding: 0; */
  align-self: center;
  width: auto;
}
</style>
