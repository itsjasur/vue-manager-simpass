<template>
  <div class="container">
    <div class="card" @click="router.push('/registration-forms')">
      <div class="img">
        <img src="../assets/icons/sim.png" alt="" />
      </div>
      <div class="textbox">
        <p class="primaryT">후불/선불유심</p>
        <p class="secondoryT">가입신청서</p>
      </div>
    </div>

    <div class="card">
      <div class="img">
        <img src="../assets/icons/docs.png" alt="" />
      </div>
      <div class="textbox">
        <p class="primaryT">정책보기</p>
      </div>
    </div>
    <div class="card">
      <div class="img">
        <img src="../assets/icons/handshake.png" alt="" />
      </div>
      <div class="textbox">
        <p class="primaryT">거래요청</p>
      </div>
    </div>
    <div class="card">
      <div class="img">
        <img src="../assets/icons/store.png" alt="" />
      </div>
      <div class="textbox">
        <p class="primaryT">거래대리점</p>
      </div>
    </div>
  </div>
  <!-- <div class="card1"></div> -->
</template>

<script setup>
import router from '../router'
</script>

<style scoped>
img {
  height: 75px;
}
.container {
  display: flex;
  height: 100%;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin: 0px 20px;
  /* background-color: yellow; */
}
.card {
  height: 170px;
  width: 170px;
  padding: 10px;
  box-sizing: border-box;
  align-content: center;
}

.img {
  /* background-color: yellow; */
  display: flex;
  justify-content: center;
  margin: 10px 0px;
}

.textbox {
  /* background-color: yellow; */
  display: flex;
  flex-direction: column;
  text-align: center;
}

.primaryT {
  margin: 0;
  font-weight: 600;
  color: #565656;
}
.secondoryT {
  margin-top: 3px;
  font-weight: 400;
  color: #565656;
  margin-bottom: 0px;
}

@media (max-width: 767px) {
  .container {
    flex-direction: column;
  }

  .card {
    width: 100%;
    height: auto;
    min-height: 100px;
    display: flex;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;
  }

  .textbox {
    margin-left: 10px;
    width: 100%;
    text-align: start;
  }

  .primaryT {
    margin-bottom: 10px;
  }
}
</style>
