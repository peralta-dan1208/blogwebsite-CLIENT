<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const router = useRouter();
const notyf = new Notyf();

const title = ref('');
const content = ref('');

const createPost = async () => {
  try {
    const res = await api.post('/posts/create-post', {
      title: title.value,
      content: content.value
    });

    notyf.success('Post created successfully');

    const postId = res.data.post._id;

    router.push(`/posts/${postId}`);

  } catch (err) {
    notyf.error(err.response?.data?.message || 'Failed to create post');
  }
};
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="mb-4">Create Post</h2>

          <div class="mb-3">
            <input v-model="title" class="form-control" placeholder="Post title"/>
          </div>

          <div class="mb-3">
            <textarea v-model="content" rows="8" class="form-control" placeholder="Write your content..."></textarea>
          </div>

          <button @click="createPost" class="btn btn-success">
            Publish Post
          </button>
        </div>
      </div>
    </div>
  </div>
</template>