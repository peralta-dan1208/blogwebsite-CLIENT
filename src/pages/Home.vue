<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const posts = ref([]);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(async () => {
  const res = await api.get('/posts');
  posts.value = res.data;
});
</script>

<template>
  <div>
    <h1 class="mb-4">Latest Posts</h1>

    <div v-for="post in posts" :key="post._id" class="card mb-3 shadow-sm">
      <router-link class="text-decoration-none text-dark" :to="`/posts/${post._id}`">
      <div class="card-body">
        <h4 class="card-title">{{ post.title }}</h4>
        <p class="text-muted mb-0">
          by <strong>{{ post.author?.username }}</strong> - Posted on {{ formatDate(post.createdOn) }}
        </p>
      </div>
      </router-link>
    </div>
  </div>
</template>