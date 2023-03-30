<template>
    <canvas ref="webgl"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Experience from '@/Tengine/experience';

const webgl = ref()

onMounted(() => {
    new Experience(webgl.value)
})

</script>



<style scoped></style>
