<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div 
      v-for="blok in blok.columns" 
      :key="blok._uid" 
      class="p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <StoryblokComponent :blok="blok" /> 
    </div>
  </div>
</template>

<script setup>
defineProps({ blok: Object });
</script>