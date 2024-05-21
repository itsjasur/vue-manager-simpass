<template>
  <div class="container">
    <div class="row">
      <!-- <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="username" />
        </a-form-item>
      </a-form> -->

      <p>asdkjlaslkj lkjasdlkj asajaslkdj aslkjdlaks jdlkasjlk</p>

      <a-select
        class="custom-select"
        ref="select"
        v-model:value="value1"
        style="width: 100%"
        size="large"
        placeholder="Please select"
        @focus="focus"
        @change="handleChange"
        :options="options"
      >
      </a-select>
    </div>
  </div>
</template>

//
<script setup>
import { ref } from 'vue'

const username = ref('')
const pname = ref('')
const color = ref('')

const options = [...Array(25)].map((_, i) => ({
  value: (i + 10).toString(36) + (i + 1)
}))
</script>

<style scoped>
.container {
  width: 80%;

  min-width: 300px;
}

.row {
  display: flex;
  width: 100%;
  gap: 15px; /* adds spacing between items */
  align-items: center;
  /*   
  justify-content: center;
  justify-items: center;
  align-content: center; */
}
</style>
