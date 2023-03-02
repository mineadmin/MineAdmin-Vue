<template>
  <ma-form v-model="form" :options="options" :columns="columns" />
</template>
<script setup>
import { ref } from 'vue'

const form = ref({})
const options = ref({})
const columns = ref([])

</script>