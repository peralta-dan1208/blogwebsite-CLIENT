<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

const posts = ref([]);
const myPosts = ref([]);
const currentUser = ref(null);

const loadMyPosts = async () => {
  try {
    const userRes = await api.get('/users/details');
    currentUser.value = userRes.data.user;

    const postRes = await api.get('/posts');
    posts.value = postRes.data;

    myPosts.value = posts.value.filter(
      post => post.author?._id === currentUser.value._id
    );
  } catch (err) {
    notyf.error('Failed to load your posts');
  }
};

const deletePost = async (id) => {
  try {
    await api.delete(`/posts/${id}`);
    await loadMyPosts();

    notyf.success('Post deleted');
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Failed to delete post');
  }
};

onMounted(loadMyPosts);
</script>

<template>
  <div>
    <h2 class="mb-4">My Posts</h2>
    <div v-for="post in myPosts" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4>{{ post.title }}</h4>
        <p class="text-muted">
          by {{ post.author?.username }}
        </p>

        <router-link class="btn btn-sm btn-outline-primary me-2" :to="`/posts/${post._id}`">
          View
        </router-link>

        <router-link class="btn btn-sm btn-outline-secondary me-2" :to="`/posts/${post._id}/edit`">
          Edit
        </router-link>

        <button class="btn btn-sm btn-outline-danger" @click="deletePost(post._id)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>