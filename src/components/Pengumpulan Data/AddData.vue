<template>
  <div class="w-full mx-auto p-4">
    <div class="card p-10 md:p-8 shadow-lg bg-white rounded-lg">
      <!-- Card Container -->
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Tambah Data</h1>
        <p class="mt-2 text-gray-600">Silakan isi form berikut dengan lengkap</p>
      </div>

      <!-- Loading Overlay -->
      <div v-if="isLoading" class="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 shadow-xl flex items-center space-x-4">
          <svg class="w-8 h-8 text-blue-600 animate-spin" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span class="text-gray-700 font-medium">Memproses...</span>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Wilayah Field -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Wilayah <span class="text-red-500">*</span>
          </label>
          <div>
            <select v-model="form.city"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required>
              <option value="" disabled>Pilih Wilayah</option>
              <option v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>
        </div>

        <!-- Kategori Field -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Kategori <span class="text-red-500">*</span>
          </label>
          <div class="flex space-x-3">
            <div class="relative flex-1">
              <select v-model="form.category_id"
                class="block w-full pl-3 pr-10 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                required>
                <option value="" disabled>Pilih Kategori</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="flex space-x-2">
              <input v-model="newCategory" type="text" placeholder="Kategori Baru"
                class="block w-full px-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <button type="button" @click="addCategory"
                class="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Tahun Field -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tahun <span class="text-red-500">*</span>
          </label>
          <input type="number" v-model="form.year" min="2000" max="2024" placeholder="Contoh: 2024"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required />
        </div>

        <!-- Nilai Field -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nilai <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <!-- <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                Rp
              </span> -->
            <input type="number" v-model="form.amount" step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <AddButton />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AddButton from '../Button/AddButton.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  components: {
    AddButton,
  },
  name: 'AddDataPage',
  setup() {
    const toast = useToast();
    const form = ref({
      amount: '',
      year: '',
      city: '',
      category_id: ''
    });

    const cities = [
      "Kota Yogyakarta",
      "Kulon Progo",
      "Kota Bandung",
      "Kota Surabaya",
      "Banyuwangi"
    ];

    const isLoading = ref(false);
    const newCategory = ref('');
    const categories = ref([]);

    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.datapolicy.jogjacode.id/api/categories');
        categories.value = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Gagal memuat data kategori');
      }
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        await axios.post('https://api.datapolicy.jogjacode.id/api/data', form.value);
        toast.success('Data berhasil ditambahkan');
        // Reset form
        form.value = {
          amount: '',
          year: '',
          city: '',
          category_id: ''
        };
      } catch (error) {
        console.error('Error submitting data:', error);
        toast.error('Gagal menyimpan data');
      } finally {
        isLoading.value = false;
      }
    };

    const addCategory = async () => {
      if (!newCategory.value.trim()) {
        toast.warning('Nama kategori tidak boleh kosong');
        return;
      }

      try {
        const response = await axios.post('https://api.datapolicy.jogjacode.id/api/categories', {
          name: newCategory.value.trim()
        });
        categories.value.push(response.data);
        toast.success('Kategori berhasil ditambahkan');
        form.value.category_id = response.data.id;
        newCategory.value = '';
      } catch (error) {
        console.error('Error adding category:', error);
        toast.error('Gagal menambahkan kategori');
      }
    };

    onMounted(() => {
      fetchCategories();
    });

    return {
      newCategory,
      addCategory,
      form,
      cities,
      categories,
      handleSubmit,
      isLoading
    };
  }
};
</script>
