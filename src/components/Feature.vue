<template>
  <div class="bg-white shadow-md rounded-lg p-6 border hover:shadow-lg transition-shadow">
    <!-- Input field for name -->
    <input
      v-model="name"
      :disabled="completed"
      class="w-full p-2 text-lg font-bold border-b focus:outline-none focus:border-blue-400"
      :class="{ 'line-through text-gray-400': completed }"
    />
    <p v-if="completed" class="text-sm text-red-500 mt-1">Completed tasks cannot be renamed.</p>

    <!-- Action buttons -->
    <div class="mt-4 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
      <button
        @click="toggleComplete"
        class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        {{ completed ? "Mark Incomplete" : "Mark Complete" }}
      </button>
      <button
        v-if="!completed"
        @click="updateFeature"
        class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Update
      </button>
      <button
        @click="confirmDelete"
        class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const props = defineProps({ blok: Object });

const name = ref(props.blok.name);
const completed = ref(props.blok.completed || false);

const updateFeature = async () => {
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
    }, 3000);
  } catch (error) {
    console.error("Error updating feature:", error);
  }
};

const toggleComplete = () => {
  completed.value = !completed.value;
  updateFeature();
};
</script>
