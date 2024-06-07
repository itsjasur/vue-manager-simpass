<template>
  <div class="overlay">
    <div class="popup-content">
      <div class="innerHeader">
        <h3 class="title">주소 검색</h3>
        <span @click="popup.close()" class="material-symbols-outlined close-button"> cancel </span>
      </div>

      <div class="scrollable-content">
        <img
          class="image"
          src="https://assets-global.website-files.com/62c67bbf65af229e9075fedf/65e723708e6199ee3a9b35a8_Software-Design-Documentation.png"
          alt=""
        />
        <img class="image" src="https://i.pinimg.com/736x/0f/a3/96/0fa39678dcc01176d67d9d951aae8362.jpg" alt="" />
      </div>

      <button class="print-button">
        <span class="material-symbols-outlined print-icon"> print </span>
        <span>출력</span>
      </button>
    </div>
  </div>
</template>

<script setup></script>

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
  background-color: #fbfbfb;
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
}

.close-button {
  font-size: 30px;
}

.image {
  width: 100%;
}

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
  padding: 0 20px;
  font-size: 16px;
  box-shadow: 0 0 5px var(--main-color);
}

.print-icon {
  font-size: 25px;
  margin-right: 10px;
}
</style>
