<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <header>
        <span class="title"> {{ title }}</span>
      </header>
      <main class="content">
        <slot></slot>
      </main>
      <footer class="footer">
        <span class="play" @click="onOk">Play</span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'


interface ModalProps {
  title: string
  visible: boolean
}

const props = defineProps<ModalProps>()

const showModal = ref<boolean>(props.visible)

const closeModal = () => {
  showModal.value = false
}

const onOk = () => {
  closeModal()
}

const onCancel = () => {
  closeModal()
}

</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #edb9b9;
  padding: 20px;
  padding-top: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  width: 900px;
  min-height: 450px;
  overflow: auto;
}

.content {
  height: 350px;
}

.footer {
  float: right;
}

.title {
  font-size: 2rem;
  font-weight: 600;

}

.play {
  font-size: 2rem;
  font-weight: 600;
  cursor: pointer;
}
</style>