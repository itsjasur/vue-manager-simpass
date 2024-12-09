<template>
  <input :value="modelValue" ref="input" v-bind="$attrs" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Cleave from 'cleave.js'
import 'cleave.js/dist/addons/cleave-phone.kr'

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

defineOptions({ inheritAttrs: false })

const emit = defineEmits(['update:modelValue', 'rawValue', 'maskedValue'])

const input = ref(null)
let cleave

const initCleave = () => {
  if (!input.value) return

  const cleaveOptions = {
    ...props.options,
    onValueChanged: (event) => {
      emit('update:modelValue', event.target.value)
      emit('rawValue', event.target.rawValue)
      emit('maskedValue', event.target.value)
    },
  }

  cleave = new Cleave(input.value, cleaveOptions)
}

onMounted(() => {
  initCleave()

  if (props.modelValue) {
    setTimeout(() => {
      cleave.setRawValue(props.modelValue)
    }, 0)
  }
})

onBeforeUnmount(() => {
  if (cleave) {
    cleave.destroy()
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (cleave && newValue !== undefined) {
      if (newValue !== cleave.getFormattedValue()) {
        cleave.setRawValue(newValue)
      }
    }
  }
)

watch(
  () => props.options,
  (newOptions) => {
    if (cleave) {
      cleave.destroy()
      initCleave()
      if (props.modelValue) {
        cleave.setRawValue(props.modelValue)
      }
    }
  },
  { deep: true }
)
</script>
