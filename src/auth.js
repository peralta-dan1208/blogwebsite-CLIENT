import { ref } from 'vue';

export const isLoggedIn = ref(!!localStorage.getItem('token'));

export const loginUser = (token) => {
  localStorage.setItem('token', token);
  isLoggedIn.value = true;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  isLoggedIn.value = false;
};