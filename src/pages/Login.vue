<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { loginUser } from '../auth';

const router = useRouter();
const notyf = new Notyf();

const email = ref('');
const password = ref('');

const login = async () => {
  try {
    const res = await api.post('/users/login', {
      email: email.value,
      password: password.value
    });

    loginUser(res.data.access);

    notyf.success('Logged in successfully');

    router.push('/');
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Login failed');
  }
};
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="mb-4">Login</h2>
          <div class="mb-3">
            <input v-model="email" type="email" class="form-control" placeholder="Email"/>
          </div>

          <div class="mb-3">
            <input v-model="password" type="password" class="form-control" placeholder="Password" />
          </div>

          <button @click="login" class="btn btn-dark w-100">
            Login
          </button>

          <p class="text-center mt-3 mb-0">
            No account?
            <router-link to="/register">
              Register now
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>