<script>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';

export default {
  setup() {
    const toast = useToast();
    const isLoading = ref(false);
    const fetchedData = ref([]);
    const wilayah = ref(''); // Default to Kota Yogyakarta
    const jenis_data = ref(''); // Default to 333
    const tahun = ref(''); // Default to 2019

    // Computed property untuk mengontrol status tombol
    const isFormValid = computed(() => {
      return wilayah.value && jenis_data.value && tahun.value;
    });

    // Data options
    const jenisDataOptions = [
      { value: '619', label: 'Jumlah Penduduk Miskin' },
      { value: '413', label: 'Indeks Pembangunan Manusia' },
      { value: '333', label: 'Indeks Gini' }, // New option
    ];

    const wilayahOptions = [
      { value: 'Kota Yogyakarta', label: 'Kota Yogyakarta' },
      { value: 'Kulonprogo', label: 'Kabupaten Kulon Progo' },
      { value: 'Kota Surabay', label: 'Kota Surabaya' },
      { value: 'Banyuwangi', label: 'Kabupaten Banyuwangi' },
      { value: 'Kota Bandung', label: 'Kota Bandung' },
    ];

    const tahunOptions = [
      { value: '2020', label: '2020' },
      { value: '2021', label: '2021' },
      { value: '2022', label: '2022' },
      { value: '2023', label: '2023' },
    ];

    const fetchData = async () => {
      if (!isFormValid.value) {
        toast.warning('Mohon lengkapi semua field yang diperlukan');
        return;
      }

      try {
        const params = {
          wilayah: wilayah.value,
          jenis_data: jenis_data.value,
          tahun: tahun.value
        };
        isLoading.value = true;

        const response = await axios.post('http://127.0.0.1:5000/api/indeks-gini', params, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          fetchedData.value = response.data.data;
          toast.success('Data berhasil diambil', {
            timeout: 3000,
            closeButton: true,
          });
        } else {
          throw new Error('Gagal mengambil data');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data', {
          timeout: 5000,
          closeButton: true,
        });
        console.error("Error:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const faqHelp = async () => {
      return toast.info('Panduan penggunaan: 1. Pilih jenis data 2. Pilih wilayah 3. Pilih periode waktu 4. Klik tombol Ambil Data')
    }

    return {
      isLoading,
      fetchedData,
      wilayah,
      jenis_data,
      tahun,
      fetchData,
      isFormValid,
      jenisDataOptions,
      wilayahOptions,
      tahunOptions,
      faqHelp,
    };
  }
};
</script>

<template>
  <div class="w-full mx-auto p-4">
    <div class="card p-10 md:p-8 shadow-lg bg-white rounded-lg">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Indeks Gini</h1>
        </div>

      <!-- Form -->
      <form @submit.prevent="fetchData" class="space-y-6">
        <!-- Jenis Data -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Jenis Data <span class="text-red-500">*</span>
          </label>
          <select
            v-model="jenis_data"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option disabled value="">Pilih jenis data yang ingin diambil</option>
            <option
              v-for="option in jenisDataOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Wilayah -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Kabupaten/Kota <span class="text-red-500">*</span>
          </label>
          <select
            v-model="wilayah"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option disabled value="">Pilih wilayah</option>
            <option
              v-for="option in wilayahOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Tahun -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Periode Data <span class="text-red-500">*</span>
          </label>
          <select
            v-model="tahun"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option disabled value="">Pilih periode waktu data</option>
            <option
              v-for="option in tahunOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
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
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Mengambil Data...
            </span>
            <span v-else>
              Ambil Data
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Loading Overlay -->
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl">
      <div class="flex flex-col items-center space-y-4">
        <svg class="w-12 h-12 text-blue-600 animate-spin" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <p class="text-gray-700 font-medium">Sedang mengambil data...</p>
        <p class="text-sm text-gray-500">Mohon tunggu sebentar</p>
      </div>
    </div>
  </div>
</template>
