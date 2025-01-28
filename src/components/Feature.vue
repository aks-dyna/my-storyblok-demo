<template>
  <div class="bg-white shadow-md rounded-lg p-6 border hover:shadow-lg transition-shadow">
    <!-- Input field for name -->
    <input
      v-model="name"
      :disabled="completed || loading"
      class="w-full p-2 text-lg font-bold border-b focus:outline-none focus:border-blue-400"
      :class="{ 'line-through text-gray-400': completed, 'cursor-not-allowed opacity-50': loading }"
    />
    <p v-if="completed" class="text-sm text-red-500 mt-1">Completed tasks cannot be renamed.</p>

    <!-- Action buttons -->
    <div class="mt-4 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
      <button
        :disabled="loading"
        @click="toggleComplete"
        class="w-full sm:w-auto px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ completed ? "Mark Incomplete" : "Mark Complete" }}
      </button>

      <button
        v-if="!completed"
        :disabled="loading"
        @click="updateFeature"
        class="w-full sm:w-auto px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Update
      </button>

      <button
        :disabled="loading"
        @click="confirmDelete"
        class="w-full sm:w-auto px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center mt-4">
      <svg
        class="animate-spin h-6 w-6 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const props = defineProps({ blok: Object });

const name = ref(props.blok.name);
const completed = ref(props.blok.completed || false);
const loading = ref(false); // Tracks the loading state

const updateFeature = async () => {
  loading.value = true; // Start loading
  try {
    const response = await axios.get(
      `https://api-us.storyblok.com/v1/spaces/${import.meta.env.VITE_SPACEID}/stories/${import.meta.env.VITE_STORYID}`,
      {
        headers: { Authorization: import.meta.env.VITE_OAUTH_TOKEN },
      }
    );

    const story = response.data.story;
    const content = story.content;

    const gridIndex = content.body.findIndex((item) => item.component === "grid");
    const grid = content.body[gridIndex];
    const featureIndex = grid.columns.findIndex((feature) => feature._uid === props.blok._uid);

    grid.columns[featureIndex] = {
      ...grid.columns[featureIndex],
      name: name.value,
      completed: completed.value,
    };

    await axios.put(
      `https://api-us.storyblok.com/v1/spaces/${import.meta.env.VITE_SPACEID}/stories/${import.meta.env.VITE_STORYID}`,
      {
        story: { content },
      },
      { headers: { Authorization: import.meta.env.VITE_OAUTH_TOKEN } }
    );

    alert("Feature updated successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (error) {
    console.error("Error updating feature:", error);
  } finally {
    loading.value = false; // Stop loading
  }
};

const toggleComplete = () => {
  completed.value = !completed.value;
  updateFeature();
};

const confirmDelete = async () => {
  const confirmed = confirm("Are you sure you want to delete this feature?");
  if (confirmed) {
    loading.value = true; // Start loading
    await deleteFeature();
    loading.value = false; // Stop loading
  }
};

const deleteFeature = async () => {
  try {
    const response = await axios.get(
      `https://api-us.storyblok.com/v1/spaces/${import.meta.env.VITE_SPACEID}/stories/${import.meta.env.VITE_STORYID}`,
      {
        headers: { Authorization: import.meta.env.VITE_OAUTH_TOKEN },
      }
    );

    const story = response.data.story;
    const content = story.content;

    const gridIndex = content.body.findIndex(
      (item) => item.component === "grid"
    );
    if (gridIndex === -1) {
      console.error("Grid component not found in the body.");
      return;
    }

    const grid = content.body[gridIndex];

    grid.columns = grid.columns.filter(
      (feature) => feature._uid !== props.blok._uid
    );

    await axios.put(
      `https://api-us.storyblok.com/v1/spaces/${import.meta.env.VITE_SPACEID}/stories/${import.meta.env.VITE_STORYID}`,
      {
        story: { content },
      },
      {
        headers: { Authorization: import.meta.env.VITE_OAUTH_TOKEN },
      }
    );

    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (error) {
    console.error("Error deleting feature:", error);
  }
};
</script>