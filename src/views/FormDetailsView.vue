<template>
  <div class="container">
    <!--  -->

    <div class="partition">
      <div class="title">요금제 정보</div>
      <template v-for="(item, index) in usimForms" :key="index">
        <component :is="generateForms(item)" />
      </template>

      <div class="title">Customer</div>
      <template v-for="(item, index) in customerForms" :key="index">
        <component :is="generateForms(item)" />
      </template>
    </div>

    <!-- USIM FORMS -->

    <!-- <template v-for="(item, index) in forms[partIndex]" :key="index">
          <div v-if="item.type === 'input'" class="group" :style="{ maxWidth: item.width }">
            <label>{{ item.label }}</label>
            <input v-model="item.value" readonly :placeholder="item.placeholder" />
          </div>

          <div v-if="item.type === 'select'" class="group" :style="{ maxWidth: item.width }">
            <label>{{ item.label }}</label>
            <a-select
              v-model:value="item.value"
              :style="{ width: '100%' }"
              :placeholder="item.placeholder"
              :options="item.options"
            >
            </a-select>
          </div>

          <div v-if="item.type === 'cleave-input'" class="group" :style="{ maxWidth: item.width }">
            <label>{{ item.label }}</label>
            <input
              v-model="item.birthdate"
              :placeholder="item.placeholder"
              v-cleave="{
                date: true,
                delimiter: '-',
                datePattern: ['Y', 'm', 'd'],
              }"
            />
          </div>
        </template> -->
  </div>
</template>

<script setup>
import { ref, h, resolveDirective, withDirectives } from 'vue'
import { USIM_INFO_FORMS, CUSTOMER_INFO_FORMS } from '../assets/constants_forms'
import { Select } from 'ant-design-vue'

const usimForms = ref(USIM_INFO_FORMS)
const customerForms = ref(CUSTOMER_INFO_FORMS)

const generateForms = (item) => {
  if (item.type === 'select') {
    return h(
      'div',
      {
        class: 'group',
        style: { maxWidth: item.width },
      },
      [
        h('label', null, item.label),

        h(Select, {
          'v-model:value': item.value,
          // 'onUpdate:modelValue': (value) => {
          //   item.value = value
          // },

          onChange: (newValue) => {
            item.value = newValue
            console.log('Select value updated:', newValue)
          },
          style: { width: '100%' },
          placeholder: item.placeholder,
          options: item.options,
        }),
      ]
    )
  }

  if (item.type === 'input') {
    return h(
      'div',
      {
        class: 'group',
        style: { maxWidth: item.width },
      },
      [
        h('label', null, item.label),
        h('input', {
          'v-model:value': item.value,
          // 'onUpdate:modelValue': (value) => {
          //   item.value = value
          // },

          onInput: (event) => {
            item.value = event.target.value
          },
          onClick: () => {
            console.log('Input field clicked')
          },
          style: { width: '100%' },
          placeholder: item.placeholder,
          options: item.options,
        }),
      ]
    )
  }

  if (item.type === 'cleave-birthday-input') {
    return h(
      'div',
      {
        class: 'group',
        style: { maxWidth: item.width },
      },
      [
        h('label', null, item.label),

        // Generate form input with v-cleave directive
        withDirectives(
          h('input', {
            placeholder: item.placeholder,
            value: item.value,
            style: { maxWidth: '300px' },
            onInput: (event) => {
              item.value = event.target.value
            },
          }),
          [
            [
              resolveDirective('cleave'),
              {
                date: true,
                delimiter: '-',
                datePattern: ['Y', 'm', 'd'],
              },
            ],
          ]
        ),
      ]
    )
  }
}

const fetchedData = ref({})
</script>

<style scoped>
.container {
  max-width: 1400px;
  padding: 0 15px;
  box-sizing: border-box;
  background-color: #7fffd41b;

  /* height: 100%; */
  width: 100%;
  /* background-color: yellow; */
  /* display: flex; */
  /* flex-wrap: wrap; */
  /* gap: 20px; */
}

.partition {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.group {
  width: 400px;
}

.title {
  /* background-color: aqua; */
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 0px;
  width: 100%;
}
</style>
