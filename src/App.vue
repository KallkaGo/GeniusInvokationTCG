<template>
  <canvas ref="webgl"></canvas>
  <div class="content" v-show="result.length">
    result :
    <template v-for="(item, index) in result" :key="index">
      <div class="container">
        <div class="icon" :style="{ backgroundColor: color[item] }"></div>
        <span>{{ item }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import Experience from "@/Tengine/experience";
import { color } from "@/components/dice/coloInfo/color";

const experience = ref();

const result = ref<any[]>([]);

const isShow = ref<boolean>(false);

const webgl = ref();

const handleData = (...value: any[]) => {
  result.value = value;
};

onMounted(() => {
  experience.value = new Experience(webgl.value);
  experience.value.time.on("getResult", handleData);
  experience.value.time.on("throw", () => {
    result.value = [];
  });
});

onUnmounted(() => {
  experience.value.time.off("getResult", handleData);
  experience.value.time.on("throw", () => {
     result.value = [];
  });
});
</script>



<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 15px;
}
.content {
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
.icon {
  width: 10px;
  height: 10px;
  margin-right: 10px;
  transform: rotate(45deg);
}
</style>
