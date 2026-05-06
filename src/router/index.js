import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import PostView from '../pages/PostView.vue';
import CreatePost from '../pages/CreatePost.vue';
import MyPosts from '../pages/MyPosts.vue';
import EditPost from '../pages/EditPost.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/create', component: CreatePost, meta: { requiresAuth: true }},
  { path: '/posts/:postId', component: PostView },
  { path: '/my-posts', component: MyPosts, meta: { requiresAuth: true }},
  { path: '/posts/:postId/edit', component: EditPost, meta: { requiresAuth: true }}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  next();
});

export default router;