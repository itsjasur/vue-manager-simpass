<template>
  <input :value="modelValue" @input="onInput" ref="input" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, watchEffect, nextTick } from 'vue'
import Cleave from 'cleave.js'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'rawValue'])

const input = ref(null)
let cleave

onMounted(() => {
  if (input.value) {
    const cleaveOptions = {
      ...props.options,
      onValueChanged: (event) => {
        emit('update:modelValue', event.target.value)
        emit('rawValue', event.target.rawValue)
      },
    }

    cleave = new Cleave(input.value, cleaveOptions)
    // cleave = new Cleave(input.value, props.options)

    if (props.modelValue) {
      cleave.setRawValue(props.modelValue)
    }
  }
})

onBeforeUnmount(() => {
  if (cleave) {
    cleave.destroy()
  }
})
</script>
