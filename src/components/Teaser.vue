<template>
  <div class="py-10 from-white-100 via-white-50 to-white-100">
    <div v-editable="blok" class="text-center">
      <!-- Headline -->
      <h1 class="text-4xl sm:text-5xl font-bold text-black-800 mb-12">
        {{ blok.headline }}
      </h1>

      <!-- Add Task Section -->
      <div
        class="mx-auto w-full max-w-4xl bg-white shadow-md border rounded-lg px-6 py-8 flex flex-col items-center"
      >
        <h2 class="text-xl sm:text-2xl font-semibold text-blue-700 mb-6">
          Add a New Task
        </h2>
        <input
          v-model="newTask"
          class="w-full p-4 text-lg bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your task name..."
        />
        <button
          @click="addTask"
          class="mt-6 w-full sm:w-auto px-6 py-3 text-lg bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
        >
          Add Task
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const props = defineProps({ blok: Object });
const newTask = ref("");

const addTask = async () => {
  if (!newTask.value.trim()) {
    alert("Task name cannot be empty!");
    return;
  }

  try {
    const response = await axios.get(
      `https://api-us.storyblok.com/v1/spaces/${import.meta.env.VITE_SPACEID}/stories/${import.meta.env.VITE_STORYID}`,
      {
        headers: {
          Authorization: import.meta.env.VITE_OAUTH_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const story = response.data.story;
    const content = story.content;

    const gridIndex = content.body.findIndex((item) => item.component === "grid");
    if (gridIndex === -1) {
      console.error("Grid component not found.");
      return;
    }

    const grid = content.body[gridIndex];
    const newFeature = {
      _uid: `feature-${Date.now()}`,
      name: newTask.value.trim(),
      component: "feature",
      completed: false,
    };

    grid.columns.push(newFeature);

    await axios.put(
      `https://api-us.storyblok.com/v1/spaces/${import.meta.env.VITE_SPACEID}/stories/${import.meta.env.VITE_STORYID}`,
      {
        story: { content },
      },
      {
        headers: {
          Authorization: import.meta.env.VITE_OAUTH_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    newTask.value = "";
    alert("Task added successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  } catch (error) {
    console.error("Error adding task:", error);
  }
};
</script>
