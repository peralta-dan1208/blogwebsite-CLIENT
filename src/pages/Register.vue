<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const router = useRouter();
const notyf = new Notyf();

const email = ref('');
const username = ref('');
const password = ref('');

const register = async () => {
  try {
    await api.post('/users/register', {
      email: email.value,
      username: username.value,
      password: password.value
    });

    notyf.success('Registered successfully');

    email.value = '';
    username.value = '';
    password.value = '';

    router.push('/login');
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Registration failed');
  }
};
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="mb-4">Register</h2>
          <div class="mb-3">
            <input v-model="email" type="email" class="form-control" placeholder="Email"/>
          </div>

          <div class="mb-3">
            <input v-model="username" class="form-control" placeholder="Username"
            />
          </div>

          <div class="mb-3">
            <input v-model="password" type="password" class="form-control" placeholder="Password"/>
          </div>
          <button @click="register" class="btn btn-primary w-100">
            Register
          </button>
        </div>
      </div>
    </div>
  </div>
</template>