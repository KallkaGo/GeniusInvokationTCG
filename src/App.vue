<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Experience from '@/Tengine/experience';

const webgl = ref()

onMounted(() => {
    new Experience(webgl.value)

})

</script>

<template>
    <canvas ref="webgl"></canvas>
</template>

<style scoped></style>
