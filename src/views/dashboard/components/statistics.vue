<template>

  <st-welcome />
  <st-count />
  <st-login-chart />

  <div class="flex justify-between mt-3">
    <st-announced />
    <st-mineadmin />
  </div>
</template>

<script setup>
  import stCount from './components/st-count.vue'
  import stWelcome from './components/st-welcome.vue'
  import stLoginChart from './components/st-loginChart.vue'
  import stMineadmin from './components/st-mineadmin.vue'
  import stAnnounced from './components/st-announced.vue'
</script>

