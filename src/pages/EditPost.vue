<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const route = useRoute();
const router = useRouter();
const notyf = new Notyf();

const title = ref('');
const content = ref('');

const loadPost = async () => {
  try {
    const res = await api.get(`/posts/${route.params.postId}`);
    title.value = res.data.title;
    content.value = res.data.content;
  } catch {
    notyf.error('Post not found');
    router.push('/my-posts');
  }
};

const updatePost = async () => {
  try {
    await api.patch(`/posts/${route.params.postId}/update`, {
      title: title.value,
      content: content.value
    });

    notyf.success('Post updated successfully');
    router.push('/my-posts');
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Failed to update post');
  }
};

onMounted(loadPost);
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="mb-4">Edit Post</h2>
          <div class="mb-3">
            <input v-model="title" class="form-control" placeholder="Title"
            />
          </div>

          <div class="mb-3">
            <textarea v-model="content" rows="8" class="form-control"></textarea>
          </div>
          <button
            @click="updatePost"
            class="btn btn-primary"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>