<template>
  <div>
    <World/>
    <Modal title="help" visible >
      <div>
       <p id="element"></p>
      </div>
    </Modal>
  </div>
  
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import World from '@/components/world.vue';
import Modal from '@/components/Modal/Modal.vue'
import Typed from 'typed.js';
import caption from '@/components/captions/captions'


onMounted(()=>{
  new Typed('#element', {
      strings: [caption],
      cursorChar: '',
      typeSpeed: 50,
    });
})

</script>

<style scoped>
#element{
  font-size: 2rem;
  text-indent: 2em;
}

</style>
