import { createApp } from 'vue';
import { StoryblokVue, apiPlugin } from '@storyblok/vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Grid from './components/Grid.vue';
import Page from './components/Page.vue';
import Teaser from './components/Teaser.vue';
import Feature from './components/Feature.vue';
import Home from './pages/Home.vue'; // Import Home component

// Define routes
const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/', // Redirect all unmatched routes to home
  },
];

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Create the Vue app
const app = createApp(App);

app.use(router); // Use Vue Router

// Configure Storyblok
app.use(StoryblokVue, {
  accessToken: import.meta.env.VITE_STORYBLOK_API_KEY,
  use: [apiPlugin],
  apiOptions: {
    region: 'us',
  },
});

// Register components
app.component('Grid', Grid);
app.component('Page', Page);
app.component('Teaser', Teaser);
app.component('Feature', Feature);

app.mount('#app');