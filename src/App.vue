<script setup>
  import { useRouter } from 'vue-router';
  import { isLoggedIn, logoutUser } from './auth';

  const router = useRouter();

  const logout = () => {
    logoutUser();
    router.push('/login');
  };
</script>

<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          Faceblog
        </router-link>
        <div class="navbar-nav ms-auto">
          <router-link class="nav-link" to="/">
            Home
          </router-link>

          <template v-if="isLoggedIn">
            <router-link class="nav-link" to="/my-posts">
              My Posts
            </router-link>
            <router-link class="nav-link" to="/create">
              Create Post
            </router-link>
          </template>

          <template v-if="!isLoggedIn">
            <router-link class="nav-link" to="/login">
              Login
            </router-link>

            <router-link class="nav-link" to="/register">
              Register
            </router-link>
          </template>
          <button v-else class="btn btn-sm btn-outline-light ms-2" @click="logoutUser" >
            Logout
          </button>
        </div>
      </div>
    </nav>
    <div class="container py-4">
      <router-view />
    </div>
  </div>
</template>