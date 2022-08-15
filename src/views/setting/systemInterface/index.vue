<template>
  <iframe :src="url" frameborder="0" width="100%" class="frame"></iframe>
</template>

<script setup>
import { ref } from 'vue'
const url = ref('http://swagger.mineadmin.com/swagger')
</script>
<script>
export default { name: 'systemInterface' }
</script>


<style scoped>
.frame {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>