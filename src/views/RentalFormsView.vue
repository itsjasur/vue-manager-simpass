<template>
  <div ref="printAble">
    <h3>Rental registration page</h3>
  </div>

  <button @click="printMe">Print</button>
</template>

<script setup>
import { ref } from 'vue'
const printAble = ref(null)

function printMe() {
  if (printAble.value) {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    // iframe.style.width = '0px'
    // iframe.style.height = '0px'
    // iframe.style.border = 'none'
    document.body.appendChild(iframe)

    iframe.onload = () => {
      const doc = iframe.contentWindow.document

      doc.open()
      doc.write(`
          <body>
            ${printAble.value.innerHTML}
          </body>
      `)
      doc.close()

      // iframe.contentWindow.onafterprint = () => {
      //   console.log('iframe removed')
      //   // Remove the iframe when printing is done
      //   document.body.removeChild(iframe)
      // }

      iframe.contentWindow.focus()
      iframe.contentWindow.print()
    }

    // Trigger iframe onload by setting the iframe's src to an empty document first
    iframe.src = 'about:blank'
  }
}
</script>
