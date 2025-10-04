<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900">Selamat Datang</h2>
        <p class="mt-2 text-sm text-gray-600">Silakan masuk untuk melanjutkan</p>
      </div>

      <!-- Menampilkan pesan error dari API -->
      <div v-if="error" class="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" v-model="email" type="email" required autocomplete="email"
            class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="relative mt-1">
            <input id="password" v-model="password" :type="passwordFieldType" required autocomplete="current-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            <!-- Tombol Show/Hide Password -->
            <button type="button" @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700">
              <svg v-if="isPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <button type="submit" :disabled="isLoading"
            class="w-full flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ isLoading ? 'Memproses...' : 'Login' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { login } from '@/api/api';

// State
const email = ref('');
const password = ref('');
const isPasswordVisible = ref(false);
const isLoading = ref(false);
const error = ref(null);

// Hooks
const router = useRouter();
const toast = useToast();

// Computed property untuk tipe input password
const passwordFieldType = computed(() => isPasswordVisible.value ? 'text' : 'password');

// Methods
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const handleLogin = async () => {
  isLoading.value = true;
  error.value = null; // Reset error setiap kali login

  try {
    const response = await login({
      email: email.value,
      password: password.value,
    });

    // Asumsi API mengembalikan token
    const token = response.data.token;
    localStorage.setItem('authToken', token); // Simpan token

    toast.success('Login berhasil!');

    // Arahkan ke halaman dashboard setelah berhasil
    router.push('/app/dashboard');

  } catch (err) {
    // Tangani error dari API
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
      toast.error(err.response.data.message);
    } else {
      error.value = 'Terjadi kesalahan. Silakan coba lagi.';
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    }
    console.error('Login failed:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>
