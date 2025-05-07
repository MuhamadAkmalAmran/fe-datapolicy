<script>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default {
  setup() {
    const toast = useToast();
    const isLoading = ref(false);
    const historyData = ref([]);
    const selectedHistory = ref(null);
    const isPreviewModalOpen = ref(false);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const itemsPerPage = 10;

    // Fetch history data
    const fetchHistory = async (page = 1) => {
      try {
        isLoading.value = true;
        const response = await axios.get(`http://127.0.0.1:5000/api/scraping-history?page=${page}&limit=${itemsPerPage}`);

        if (response.status === 200) {
          historyData.value = response.data.data;
          totalPages.value = Math.ceil(response.data.total / itemsPerPage);
          currentPage.value = page;
        } else {
          throw new Error('Gagal mengambil data riwayat');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil riwayat', {
          timeout: 5000,
          closeButton: true,
        });
        console.error("Error:", error);
      } finally {
        isLoading.value = false;
      }
    };

    // Format date and time
    const formatDateTime = (dateString) => {
      try {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy, HH:mm', { locale: id });
      } catch (e) {
        return dateString + e;
      }
    };

    // Preview data
    const previewData = async (historyId) => {
      try {
        isLoading.value = true;
        const response = await axios.get(`http://127.0.0.1:5000/api/scraping-history/${historyId}`);

        if (response.status === 200) {
          selectedHistory.value = response.data;
          isPreviewModalOpen.value = true;
        } else {
          throw new Error('Gagal mengambil detail data');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil detail', {
          timeout: 5000,
          closeButton: true,
        });
        console.error("Error:", error);
      } finally {
        isLoading.value = false;
      }
    };

    // Close preview modal
    const closePreviewModal = () => {
      isPreviewModalOpen.value = false;
      selectedHistory.value = null;
    };

    // Get jenis data label
    const getJenisDataLabel = (value) => {
      const labels = {
        '619': 'Jumlah Penduduk Miskin',
        '621': 'Persentase Penduduk Miskin',
        '413': 'Indeks Pembangunan Manusia',
        '414': 'Umur Harapan Hidup Saat Lahir',
        '333': 'Indeks Gini'
      };
      return labels[value] || value;
    };

    // Get wilayah label
    const getWilayahLabel = (value) => {
      const labels = {
        '3471': 'Kota Yogyakarta',
        '3401': 'Kabupaten Kulon Progo',
        '3578': 'Kota Surabaya',
        '3510': 'Kabupaten Banyuwangi',
        '3273': 'Kota Bandung',
        'Kota Yogyakarta': 'Kota Yogyakarta',
        'Kulonprogo': 'Kabupaten Kulon Progo',
        'Kota Surabay': 'Kota Surabaya',
        'Banyuwangi': 'Kabupaten Banyuwangi',
        'Kota Bandung': 'Kota Bandung'
      };
      return labels[value] || value;
    };

    // Handle pagination
    const goToPage = (page) => {
      if (page > 0 && page <= totalPages.value) {
        fetchHistory(page);
      }
    };

    onMounted(() => {
      fetchHistory();
    });

    return {
      historyData,
      isLoading,
      selectedHistory,
      isPreviewModalOpen,
      currentPage,
      totalPages,
      formatDateTime,
      previewData,
      closePreviewModal,
      getJenisDataLabel,
      getWilayahLabel,
      goToPage
    };
  }
};
</script>

<template>
  <div class="w-full mx-auto p-4">
    <div class="card p-6 md:p-8 shadow-lg bg-white rounded-lg">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Riwayat Pengambilan Data</h1>
        <button @click="fetchHistory(1)" class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <!-- Loading message -->
      <div v-if="isLoading" class="flex justify-center my-8">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- No data message -->
      <div v-else-if="historyData.length === 0" class="text-center py-10 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>Belum ada riwayat pengambilan data</p>
      </div>

      <!-- History table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Data</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wilayah</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in historyData" :key="item.id" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (currentPage - 1) * 10 + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(item.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getJenisDataLabel(item.jenis_data) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getWilayahLabel(item.wilayah) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.tahun }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="previewData(item.id)" class="text-blue-600 hover:text-blue-900 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between mt-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" :class="[
            'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          ]">
            Sebelumnya
          </button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" :class="[
            'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          ]">
            Selanjutnya
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Menampilkan <span class="font-medium">{{ ((currentPage - 1) * 10) + 1 }}</span> sampai <span class="font-medium">{{ Math.min(currentPage * 10, historyData.length) }}</span> dari <span class="font-medium">{{ totalPages * 10 }}</span> data
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" :class="[
                'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500',
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              ]">
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <template v-for="page in totalPages" :key="page">
                <button @click="goToPage(page)" :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]">
                  {{ page }}
                </button>
              </template>
              <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" :class="[
                'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500',
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              ]">
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="isPreviewModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closePreviewModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Detail Data
                </h3>
                <div class="mt-4 border-t border-gray-200 pt-4">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p class="text-sm font-medium text-gray-500">Jenis Data</p>
                      <p class="text-sm text-gray-900">{{ getJenisDataLabel(selectedHistory?.jenis_data) }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Wilayah</p>
                      <p class="text-sm text-gray-900">{{ getWilayahLabel(selectedHistory?.wilayah) }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Periode</p>
                      <p class="text-sm text-gray-900">{{ selectedHistory?.tahun }}</p>
                    </div>
                  </div>
                  <div class="mt-4">
                    <p class="text-sm font-medium text-gray-500 mb-2">Data Hasil Scraping</p>
                    <div class="bg-gray-50 p-4 rounded-md overflow-x-auto">
                      <pre class="text-xs text-gray-700">{{ JSON.stringify(selectedHistory?.data, null, 2) }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="closePreviewModal" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
