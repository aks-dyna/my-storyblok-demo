<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="px-6 py-8">
      <!-- Alert Popup -->
      <div
        v-if="showAlert"
        class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md"
      >
        {{ alertMessage }}
      </div>

      <!-- Render All Components -->
      <StoryblokComponent v-for="blok in blok.body" :blok="blok" :key="blok._uid" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({ blok: Object });
const showAlert = ref(false);
const alertMessage = ref("");

// Function to display alert messages
const displayAlert = (message) => {
  alertMessage.value = message;
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
  }, 3000); // Hide after 3 seconds
};
</script>
