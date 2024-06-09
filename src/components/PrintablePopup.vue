<template>
  <div class="overlay">
    <div class="popup-content">
      <div class="innerHeader">
        <h3 class="title">주소 검색</h3>
        <span @click="popup.close()" class="material-symbols-outlined close-button"> cancel </span>
      </div>

      <div class="scrollable-content">
        <img v-for="(image, index) in props.base64Images" :key="index" class="image" :src="base64Images[0]" alt="" />
      </div>

      <button @click="convertToPdfAndPrint" class="print-button">
        <span class="material-symbols-outlined print-icon"> print </span>
        <span>출력</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import jsPDF from 'jspdf'
import { TESTBASE64 } from '../assets/test.js'
import { usePrintablePopup } from '../stores/printable-popup'

const popup = usePrintablePopup()

const props = defineProps({ base64Images: { type: Array, required: true } })

//this converts base64 images to pdf and then prints pdf
// using iframe by converting pdf to url
const convertToPdfAndPrint = () => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })

  const pdfWidth = doc.internal.pageSize.getWidth()
  const pdfHeight = doc.internal.pageSize.getHeight()

  props.base64Images.forEach((imgData, index) => {
    const imgProps = doc.getImageProperties(imgData)
    let imgWidth = pdfWidth
    let imgHeight = (imgProps.height * pdfWidth) / imgProps.width

    if (imgHeight > pdfHeight) {
      imgHeight = pdfHeight
      imgWidth = (imgProps.width * pdfHeight) / imgProps.height
    }

    const x = (pdfWidth - imgWidth) / 2 // centers the image horizontally
    const y = (pdfHeight - imgHeight) / 2 // centers the image vertically

    doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)

    if (index < props.base64Images.length - 1) doc.addPage()
  })

  const pdfBlob = doc.output('blob')
  const pdfUrl = URL.createObjectURL(pdfBlob)

  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  //  focus listener handles if focus is back and then cleans up iframe
  window.addEventListener('focus', handleFocus)
  function handleFocus() {
    document.body.removeChild(iframe)
    window.removeEventListener('focus', handleFocus)
  }

  iframe.onload = () => iframe.contentWindow.print()
  iframe.src = pdfUrl
}
</script>
<style scoped>
.overlay {
  display: flex;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
  width: 1000px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: #efefef;
  position: relative;
}

.innerHeader {
  position: sticky;
  top: 0;
  height: 60px;
  padding: 0 20px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bottom shadow */
}

.scrollable-content {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 0 20px;
}

.close-button {
  font-size: 30px;
}

/* .image {
  width: 100%;
} */

.print-button {
  position: absolute; /* Add this line */
  bottom: 20px; /* Add this line */
  right: 20px; /* Add this line */
  width: auto;
  height: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  /* box-sizing: border-box; */
  padding: 0 30px;
  font-size: 16px;
  box-shadow: 0 0 10px #00000025; /* Bottom shadow */
}

.print-icon {
  font-size: 25px;
  margin-right: 10px;
}
</style>
