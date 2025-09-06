<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import { getCategories } from '@/api/api';
import axios from 'axios';

export default {
  name: 'ScrapeApbdPage',
  setup() {
    const toast = useToast();
    const isLoading = ref(false);
    const fetchedData = ref([]);
    const dropdownRef = ref(null);

    // Form data
    const form = ref({
      startYear: '',
      endYear: '',
      provinsi: '',
      pemdaCode: '',
      categoryId: '',
      categoryName: ''
    });

    // Category dropdown
    const category = ref({
      options: [],
      filtered: [],
      searchTerm: '',
      dropdownOpen: false
    });

    // Static options
    const wilayahOptions = [
      { value: '05', label: 'Kota Yogyakarta' },
      { value: '03', label: 'Kabupaten Kulon Progo' },
      { value: '17', label: 'Kota Bandung' },
      { value: '37', label: 'Kota Surabaya' },
      { value: '02', label: 'Banyuwangi' }
    ];

    const tahunOptions = Array.from({ length: 6 }, (_, i) => {
      const year = 2020 + i;
      return { value: year.toString(), label: year.toString() };
    });

    const pemdaToProvinsi = {
      '05': '12', '03': '12', '17': '10', '37': '13', '02': '13'
    };

    // Computed
    const isFormValid = computed(() =>
      form.value.startYear && form.value.endYear &&
      form.value.pemdaCode && form.value.categoryId
    );

    // Methods
    const fetchCategories = async () => {
      try {
        const response = await getCategories({ search: 'APBD' });
        if (response.status === 200) {
          const options = response.data
            .map(c => ({ value: c.id, name: c.name }))
            .sort((a, b) => a.name.localeCompare(b.name));

          category.value.options = options;
          category.value.filtered = options;
        }
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat kategori');
      }
    };

    const filterCategories = () => {
      const term = category.value.searchTerm.toLowerCase();
      category.value.filtered = category.value.options.filter(opt =>
        opt.name.toLowerCase().includes(term)
      );
    };

    const selectCategory = (option) => {
      form.value.categoryId = option.value;
      form.value.categoryName = option.name;
      category.value.searchTerm = option.name;
      closeDropdown();
    };

    const clearCategory = () => {
      form.value.categoryId = '';
      form.value.categoryName = '';
      category.value.searchTerm = '';
      category.value.filtered = category.value.options;
    };

    const openDropdown = () => {
      category.value.dropdownOpen = true;
      filterCategories();
    };

    const closeDropdown = () => {
      category.value.dropdownOpen = false;
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        closeDropdown();
      }
    };

    const fetchData = async () => {
      if (!isFormValid.value) {
        toast.warning('Mohon lengkapi semua field yang diperlukan');
        return;
      }

      isLoading.value = true;
      fetchedData.value = [];

      try {
        const params = {
          start_year: form.value.startYear,
          end_year: form.value.endYear,
          periode: 12,
          provinsi: form.value.provinsi,
          pemda_code: form.value.pemdaCode,
          category_id: form.value.categoryId
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/scrape-apbd`,
          params,
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.status === 200 && response.data.data) {
          fetchedData.value = response.data.data;
          toast.success('Data berhasil diambil');
        } else {
          fetchedData.value = [];
          toast.error('Data tidak ditemukan atau terjadi kesalahan');
        }
      } catch (err) {
        toast.error(err.response?.data?.error || 'Terjadi kesalahan saat mengambil data');
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    };

    // Watchers
    watch(() => form.value.pemdaCode, (newVal) => {
      form.value.provinsi = pemdaToProvinsi[newVal] || '';
    });

    watch(() => category.value.searchTerm, filterCategories);

    // Lifecycle
    onMounted(() => {
      fetchCategories();
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      form,
      category,
      isFormValid,
      isLoading,
      fetchedData,
      wilayahOptions,
      tahunOptions,
      dropdownRef,
      fetchData,
      selectCategory,
      clearCategory,
      openDropdown,
      closeDropdown
    };
  }
};
</script>

<template>
  <div class="w-full mx-auto p-4">
    <div class="card p-10 md:p-8 shadow-lg bg-white rounded-lg">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Scrape APBD</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="fetchData" class="space-y-6">
        <!-- Kategori dengan Search -->
        <div class="space-y-2 relative" ref="dropdownRef">
          <label class="block text-sm font-medium text-gray-700">
            Kategori <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              type="text"
              v-model="category.searchTerm"
              @focus="openDropdown"
              placeholder="Cari kategori..."
              class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <!-- Clear button -->
            <button
              v-if="category.searchTerm"
              type="button"
              @click="clearCategory"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <!-- Dropdown -->
          <div
            v-if="category.dropdownOpen"
            class="absolute w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto rounded-md shadow-lg z-10"
          >
            <div
              v-for="option in category.filtered"
              :key="option.value"
              @click="selectCategory(option)"
              class="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
            >
              {{ option.name }}
            </div>
            <div v-if="category.filtered.length === 0" class="px-3 py-2 text-gray-500 text-sm">
              Tidak ada kategori ditemukan
            </div>
          </div>
        </div>

        <!-- Wilayah -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Wilayah / Pemda <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.pemdaCode"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option disabled value="">Pilih wilayah</option>
            <option v-for="option in wilayahOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Tahun -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Tahun Mulai <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.startYear"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option disabled value="">Pilih tahun</option>
              <option v-for="option in tahunOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Tahun Akhir <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.endYear"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option disabled value="">Pilih tahun</option>
              <option v-for="option in tahunOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            :class="[
              'w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
              isFormValid && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-gray-400 cursor-not-allowed'
            ]"
          >
            <span v-if="isLoading">
              <svg class="inline w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Mengambil Data...
            </span>
            <span v-else>Ambil Data</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Loading Overlay -->
  <div v-if="isLoading"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
    <div class="bg-white p-6 rounded-lg shadow-xl">
      <div class="flex flex-col items-center space-y-4">
        <svg class="w-12 h-12 text-blue-600 animate-spin" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p class="text-gray-700 font-medium">Sedang mengambil data...</p>
        <p class="text-sm text-gray-500">Mohon tunggu sebentar</p>
      </div>
    </div>
  </div>
</template>
