<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import { Notyf } from 'notyf';
import { isLoggedIn } from '../auth';
import 'notyf/notyf.min.css';

const notyf = new Notyf();
const router = useRouter();
const route = useRoute();

const post = ref(null);
const comments = ref([]);
const comment = ref('');
const currentUser = ref(null);

const loadData = async () => {
  const [postRes, userRes, commentsRes] = await Promise.all([
    api.get(`/posts/${route.params.postId}`),
    api.get('/users/details'),
    api.get(`/posts/${route.params.postId}/comments`)
  ]);

  post.value = postRes.data;
  currentUser.value = userRes.data.user;
  comments.value = commentsRes.data.comments;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const addComment = async () => {
  try {
    await api.post(`/posts/${route.params.postId}/comments`, {
      comment: comment.value
    });

    comment.value = '';
    await loadData();

    notyf.success('Comment added');
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Failed to add comment');
  }
};

const deleteComment = async (commentId) => {
  try {
    await api.delete(
      `/posts/${post.value._id}/comments/${commentId}`
    );

    notyf.success('Comment deleted');
    await loadData();
  } catch (err) {
    notyf.error('Failed to delete comment');
  }
};

const canDeleteComment = (comment) => {
  return (
    currentUser.value &&
    (
      comment.userId === currentUser.value._id ||
      currentUser.value.isAdmin
    )
  );
};

const goToEdit = () => {
  router.push(`/posts/${post.value._id}/edit`);
};

const deletePost = async () => {
  try {
    await api.delete(`/posts/${post.value._id}`);

    notyf.success('Post deleted');
    router.push('/');
  } catch (err) {
    notyf.error('Failed to delete post');
  }
};

const isOwner = computed(() => {
  return (
    post.value &&
    currentUser.value &&
    post.value.author?._id === currentUser.value._id
  );
});

const isAdmin = computed(() => {
  return currentUser.value?.isAdmin;
});

onMounted(loadData);
</script>

<template>
  <div v-if="post">
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h2>{{ post.title }}</h2>
        <p class="text-muted mb-0">by <strong>{{ post.author?.username }}</strong></p>
        <p class="text-muted">Posted on {{ formatDate(post.createdOn) }}</p>
        <p>{{ post.content }}</p>
        <template v-if="isOwner" class="mt-3">
          <button class="btn btn-outline-secondary me-2" @click="goToEdit" >
            Edit
          </button>
        </template>

        <template v-if="isOwner || isAdmin" class="mt-3">
          <button class="btn btn-outline-danger" @click="deletePost">
            Delete
          </button>
        </template>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <h4 class="mb-3">Comments</h4>

        <div v-for="commentItem in comments" :key="commentItem._id" class="border rounded p-2 mb-2 position-relative">
          <button v-if="canDeleteComment(commentItem)" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" @click="deleteComment(commentItem._id)">
            ×
          </button>
          <strong>{{ commentItem.username }}</strong>
          <p class="mb-0">{{ commentItem.comment }}</p>
        </div>

        <template v-if="isLoggedIn">
          <textarea v-model="comment" rows="3" class="form-control mt-3" placeholder="Write a comment"></textarea>
          <button @click="addComment" class="btn btn-primary mt-2">
            Add Comment
          </button>
        </template>

        <template v-if="!isLoggedIn">
          <h5 class="mt-3 ms-2">Login to comment</h5>
        </template>
      </div>
    </div>
  </div>
</template>