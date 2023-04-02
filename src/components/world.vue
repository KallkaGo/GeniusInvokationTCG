<template>
  <div>
    <canvas ref="webgl"></canvas>
    <div class="content" v-show="result.length">
      result :
      <template v-for="(item) in result">
        <div class="container">
          <div class="icon" :style="{ backgroundColor: color[item.name as keyof typeof color] }"></div>
          <span>{{ item.name }}</span>
        </div>
      </template>
    </div>
    <div class="lockcontent" v-show="lock.length">
      Lock :
      <template v-for="(item2) in lock">
        <div class="container">
          <div class="icon" :style="{ backgroundColor: color[item2.name as keyof typeof color] }"></div>
          <span>{{ item2.name }}</span>
        </div>
      </template>
    </div>
    <button @click="handleLockData"> Add</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import Experience from "@/Tengine/experience";
import { color } from "@/components/dice/coloInfo/color";
import { count } from "@/World/phyworld";

const experience = ref();

const result = ref<any[]>([]);

const lock = ref<any[]>([])


const webgl = ref();

const handleData = (...value: any[]) => {
  result.value = value;
};

const handleLockData = (...payload: any[]) => {
  lock.value = payload
}


onMounted(() => {
  experience.value = new Experience(webgl.value);
  experience.value.time.on("getResult", handleData);
  experience.value.time.on("lockResult", handleLockData);
  experience.value.time.on("throw", () => {
    result.value = [];
    count === 2 ? lock.value = [] : null

  });
});

onUnmounted(() => {
  experience.value.time.off("getResult", handleData);
  experience.value.time.off("lockResult", handleLockData);
  experience.value.time.off("throw", () => {
    result.value = [];
    count === 2 ? lock.value = [] : null
  });
})
</script>



<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 15px;
}

.lockcontent {
  display: flex;
  position: fixed;
  bottom: 20px;
  left: 20px;
  font-family: "Indie Flower", cursive;
  font-weight: 600;
  color: wheat;
  font-size: 3rem;
  user-select: none;
}




.content {
  display: flex;
  position: fixed;
  bottom: 70px;
  left: 20px;
  font-family: "Indie Flower", cursive;
  font-weight: 600;
  color: wheat;
  font-size: 3rem;
  user-select: none;
}

.icon {
  width: 10px;
  height: 10px;
  margin-right: 10px;
  transform: rotate(45deg);
}
</style>
