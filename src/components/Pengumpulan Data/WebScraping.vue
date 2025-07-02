<template>
  <div class="w-full mx-auto p-4">
    <div class="card p-10 md:p-8 shadow-lg bg-white rounded-lg">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Data Stunting</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Kabupaten/Kota Selection -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Kabupaten/Kota <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.kab_kota"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option disabled value="">Pilih Kabupaten/Kota</option>
            <option value="Kota Yogyakarta">Kota Yogyakarta</option>
            <option value="Kulon Progo">Kabupaten Kulon Progo</option>
            <option value="Kota Surabaya">Kota Surabaya</option>
            <option value="Banyuwangi">Kabupaten Banyuwangi</option>
            <option value="Kota Bandung">Kota Bandung</option>
          </select>
        </div>

        <!-- Year Selection -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Tahun <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.year"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option disabled value="">Pilih Tahun</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="[
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

      <!-- Results Table -->
      <div v-if="fetchedData.length" class="mt-8">
        <TableStunting :data="fetchedData" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import TableStunting from '../TableStunting.vue';

export default {
  components: {
    TableStunting,
  },
  setup() {
    const toast = useToast();
    const isLoading = ref(false);
    const fetchedData = ref([]);

    // Form data with all necessary fields
    const formData = reactive({
      kab_kota: '',
      year: ''
    });

    // Computed property for form validation
    const isFormValid = computed(() => {
      return formData.kab_kota && formData.year;
    });

    // Handle form submission
    const handleSubmit = async () => {
      if (!isFormValid.value) {
        toast.warning('Mohon lengkapi semua field yang diperlukan');
        return;
      }

      isLoading.value = true;
      try {
        const response = await axios.post('https://api.datapolicy.jogjacode.id/stunting', {
          kab_kota: formData.kab_kota,
          year: formData.year
        });

        if (response.status === 200) {
          fetchedData.value = response.data.data;
          toast.success('Data berhasil diambil');
        } else {
          throw new Error('Gagal mengambil data');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data');
        console.error("Error:", error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      fetchedData,
      formData,
      handleSubmit,
      isFormValid
    };
  }
};
</script>
