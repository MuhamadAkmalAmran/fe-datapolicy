<template>
  <div class="w-full mx-auto p-4">
    <div class="card p-10 md:p-8 shadow-lg bg-white rounded-lg hover:shadow-xl transition-all duration-200">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Pengelolaan Data</h1>
      </div>

      <p class="text-gray-600 mb-6">
        Pilih metode untuk menambahkan data baru ke sistem. Anda dapat mengisi form secara manual atau mengimpor dari
        file Excel.
      </p>

      <!-- Tab Navigation -->
      <div class="w-full">
        <div class="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
          <button @click="activeTab = 'manual'" :class="['flex items-center justify-center gap-2 p-2 rounded-md transition-colors font-medium',
            activeTab === 'manual' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200']">
            <i class="i-lucide-file-plus w-4 h-4"></i> Input Manual
          </button>
          <button @click="activeTab = 'import'" :class="['flex items-center justify-center gap-2 p-2 rounded-md transition-colors font-medium',
            activeTab === 'import' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200']">
            <i class="i-lucide-upload w-4 h-4"></i> Import Excel
          </button>
        </div>

        <!-- Alert Messages -->
        <div v-if="error || success" :class="['mb-6 p-4 rounded-lg text-sm',
          error ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800']">
          <p>{{ error || success }}</p>
        </div>

        <!-- Manual Input Tab -->
        <div v-if="activeTab === 'manual'">
          <div class="bg-gray-50 p-6 rounded-lg border">
            <h3 class="font-medium text-gray-800 mb-4 text-lg">Input Data Manual</h3>
            <p class="text-sm text-gray-600 mb-6">Isi form di bawah ini untuk menambahkan data baru secara manual.</p>

            <!-- Manual form content would go here -->
            <div class="text-center py-8 text-gray-500">
              <i class="i-lucide-file-plus w-12 h-12 mx-auto mb-4 opacity-50"></i>
              <p>Form input manual akan ditambahkan di sini</p>
            </div>
          </div>
        </div>

        <!-- Import Excel Tab -->
        <div v-if="activeTab === 'import'" class="space-y-6">
          <!-- Template Generator Section -->
          <div class="bg-gray-50 p-6 rounded-lg border">
            <h3 class="font-medium text-gray-800 mb-3 text-lg">Generate Template Kustom</h3>
            <p class="text-sm text-gray-600 mb-4">Pilih filter di bawah ini untuk membuat template Excel dari server.
            </p>

            <div class="space-y-4">
              <!-- Cities Selection with Search -->
              <div class="space-y-2 relative" ref="cityDropdownRef">
                <label class="block text-sm font-medium text-gray-700">
                  Pilih Wilayah <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input type="text" v-model="city.searchTerm" @focus="openCityDropdown" placeholder="Cari wilayah..."
                    class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  <!-- Clear button -->
                  <button v-if="city.searchTerm" type="button" @click="clearCity"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>

                <!-- Dropdown -->
                <div v-if="city.dropdownOpen"
                  class="absolute w-full bg-white border border-gray-300 mt-1 max-h-64 overflow-y-auto rounded-md shadow-lg z-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div v-for="option in city.filtered" :key="option" @click="selectCity(option)" :class="['px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm',
                    templateFilters.cities.includes(option) ? 'bg-blue-50 text-blue-700' : '']">
                    <span class="flex items-center justify-between">
                      {{ option }}
                      <span v-if="templateFilters.cities.includes(option)" class="text-blue-600">✓</span>
                    </span>
                  </div>
                  <div v-if="city.filtered.length === 0" class="px-3 py-2 text-gray-500 text-sm">
                    Tidak ada wilayah ditemukan
                  </div>
                </div>

                <!-- Selected Cities Display -->
                <div v-if="templateFilters.cities.length > 0" class="flex flex-wrap gap-2 mt-2">
                  <span v-for="cityName in templateFilters.cities" :key="cityName"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {{ cityName }}
                    <button type="button" @click="removeCity(cityName)" class="hover:text-green-900">
                      ✕
                    </button>
                  </span>
                </div>
                <p class="text-xs text-gray-500">Klik untuk memilih beberapa wilayah</p>
              </div>

              <!-- Categories Selection with Search -->
              <div class="space-y-2 relative" ref="dropdownRef">
                <label class="block text-sm font-medium text-gray-700">
                  Pilih Kategori <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input type="text" v-model="category.searchTerm" @focus="openDropdown" placeholder="Cari kategori..."
                    class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  <!-- Clear button -->
                  <button v-if="category.searchTerm" type="button" @click="clearCategory"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>

                <!-- Dropdown -->
                <div v-if="category.dropdownOpen"
                  class="absolute w-full bg-white border border-gray-300 mt-1 max-h-64 overflow-y-auto rounded-md shadow-lg z-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div v-for="option in category.filtered" :key="option.id" @click="selectCategory(option)" :class="['px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm',
                    templateFilters.categories.includes(option.id) ? 'bg-blue-50 text-blue-700' : '']">
                    <span class="flex items-center justify-between">
                      {{ option.name }}
                      <span v-if="templateFilters.categories.includes(option.id)" class="text-blue-600">✓</span>
                    </span>
                  </div>
                  <div v-if="category.filtered.length === 0" class="px-3 py-2 text-gray-500 text-sm">
                    Tidak ada kategori ditemukan
                  </div>
                </div>

                <!-- Selected Categories Display -->
                <div v-if="templateFilters.categories.length > 0" class="flex flex-wrap gap-2 mt-2">
                  <span v-for="categoryId in templateFilters.categories" :key="categoryId"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {{ getCategoryName(categoryId) }}
                    <button type="button" @click="removeCategory(categoryId)" class="hover:text-blue-900">
                      ✕
                    </button>
                  </span>
                </div>
                <p class="text-xs text-gray-500">Klik untuk memilih beberapa kategori</p>
              </div>

              <!-- Year Range -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Tahun Mulai <span class="text-red-500">*</span>
                  </label>
                  <input type="number" v-model="templateFilters.startYear" :min="2020" :max="2030"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Tahun Selesai <span class="text-red-500">*</span>
                  </label>
                  <input type="number" v-model="templateFilters.endYear" :min="templateFilters.startYear || 2020"
                    :max="2030"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <!-- Generate Template Button -->
            <button @click="downloadTemplate" :disabled="isGeneratingTemplate || !isTemplateFormValid" :class="[
              'w-full mt-6 px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
              isTemplateFormValid && !isGeneratingTemplate
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-gray-400 cursor-not-allowed'
            ]">
              <span v-if="isGeneratingTemplate" class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                    fill="none" />
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <i class="i-lucide-file-down w-4 h-4"></i>
                Generate & Download Template
              </span>
            </button>
          </div>

          <!-- File Upload Section -->
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200">
            <label class="cursor-pointer block">
              <i class="i-lucide-upload w-12 h-12 mx-auto text-gray-400 mb-4"></i>
              <p class="text-sm font-medium text-gray-700 mb-2">Klik atau seret file Excel untuk diupload</p>
              <p class="text-xs text-gray-500">Format yang didukung: .xlsx, .xls</p>
              <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" class="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay for File Upload -->
    <div v-if="isUploading"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <div class="flex flex-col items-center space-y-4">
          <svg class="w-12 h-12 text-blue-600 animate-spin" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p class="text-gray-700 font-medium">Sedang mengunggah file...</p>
          <p class="text-sm text-gray-500">Mohon tunggu sebentar</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import api from '@/api/api';

// Toast notification
const toast = useToast();

// State management
const activeTab = ref('import'); // Default to import tab
const isLoading = ref(false);
const isGeneratingTemplate = ref(false);
const isUploading = ref(false);
const error = ref('');
const success = ref('');
const dropdownRef = ref(null);
const cityDropdownRef = ref(null);

// Static data
const cities = ["Kota Yogyakarta", "Kota Surabaya", "Kota Bandung", "Kulon Progo", "Banyuwangi"];
const categories = ref([]);

// City dropdown state
const city = ref({
  searchTerm: '',
  filtered: [],
  dropdownOpen: false
});

// Category dropdown state
const category = ref({
  searchTerm: '',
  filtered: [],
  dropdownOpen: false
});

// Template filters
const templateFilters = reactive({
  cities: [],
  categories: [],
  startYear: new Date().getFullYear(),
  endYear: new Date().getFullYear(),
});

// Computed properties
const isTemplateFormValid = computed(() =>
  templateFilters.cities.length > 0 &&
  templateFilters.categories.length > 0 &&
  templateFilters.startYear &&
  templateFilters.endYear &&
  templateFilters.startYear <= templateFilters.endYear
);

// Methods
const fetchCategories = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/categories');
    categories.value = response.data;

    // Initialize filtered categories
    const options = response.data.map(c => ({ id: c.id, name: c.name }));
    category.value.filtered = options.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error('Error fetching categories:', err);
    error.value = 'Gagal memuat data kategori.';
    toast.error('Gagal memuat data kategori');
  } finally {
    isLoading.value = false;
  }
};

// City methods
const filterCities = () => {
  const term = city.value.searchTerm.toLowerCase();
  city.value.filtered = cities.filter(cityName =>
    cityName.toLowerCase().includes(term)
  ).sort((a, b) => a.localeCompare(b));
};

const selectCity = (cityName) => {
  // Toggle selection instead of single select
  const index = templateFilters.cities.indexOf(cityName);
  if (index === -1) {
    templateFilters.cities.push(cityName);
  } else {
    templateFilters.cities.splice(index, 1);
  }
};

const removeCity = (cityName) => {
  const index = templateFilters.cities.indexOf(cityName);
  if (index !== -1) {
    templateFilters.cities.splice(index, 1);
  }
};

const clearCity = () => {
  templateFilters.cities = [];
  city.value.searchTerm = '';
  city.value.filtered = [...cities];
  closeCityDropdown();
};

const openCityDropdown = () => {
  city.value.dropdownOpen = true;
  filterCities();
};

const closeCityDropdown = () => {
  city.value.dropdownOpen = false;
};

// Category methods
const filterCategories = () => {
  const term = category.value.searchTerm.toLowerCase();
  const options = categories.value.map(c => ({ id: c.id, name: c.name }));
  category.value.filtered = options.filter(opt =>
    opt.name.toLowerCase().includes(term)
  ).sort((a, b) => a.name.localeCompare(b.name));
};

const selectCategory = (option) => {
  // Toggle selection instead of single select
  const index = templateFilters.categories.indexOf(option.id);
  if (index === -1) {
    templateFilters.categories.push(option.id);
  } else {
    templateFilters.categories.splice(index, 1);
  }
};

const removeCategory = (categoryId) => {
  const index = templateFilters.categories.indexOf(categoryId);
  if (index !== -1) {
    templateFilters.categories.splice(index, 1);
  }
};

const clearCategory = () => {
  templateFilters.categories = [];
  category.value.searchTerm = '';
  category.value.filtered = categories.value.map(c => ({ id: c.id, name: c.name }));
  closeDropdown();
};

const getCategoryName = (categoryId) => {
  const cat = categories.value.find(c => c.id === categoryId);
  return cat ? cat.name : '';
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
  if (cityDropdownRef.value && !cityDropdownRef.value.contains(event.target)) {
    closeCityDropdown();
  }
};

const downloadTemplate = async () => {
  if (!isTemplateFormValid.value) {
    error.value = 'Mohon lengkapi semua field yang diperlukan.';
    toast.warning('Mohon lengkapi semua field yang diperlukan');
    return;
  }

  isGeneratingTemplate.value = true;
  error.value = '';
  success.value = '';

  try {
    // Build query parameters
    const params = new URLSearchParams();
    templateFilters.cities.forEach(city => params.append('city', city));

    // Get category names from IDs
    const categoryNames = templateFilters.categories.map(catId => {
      const cat = categories.value.find(c => c.id === catId);
      return cat ? cat.name : '';
    }).filter(Boolean);

    categoryNames.forEach(name => params.append('category', name));
    params.append('start_year', templateFilters.startYear);
    params.append('end_year', templateFilters.endYear);

    const response = await api.get(`/export-custom-template?${params.toString()}`, {
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Get filename from response headers
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'template-kustom.xlsx';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch.length === 2) {
        filename = filenameMatch[1];
      }
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    success.value = 'Template kustom berhasil diunduh dari server.';
    toast.success('Template berhasil diunduh');
  } catch (err) {
    console.error('Error downloading template:', err);
    error.value = err.response?.data?.error || 'Gagal mengunduh template. Pastikan semua filter terisi.';
    toast.error('Gagal mengunduh template');
  } finally {
    isGeneratingTemplate.value = false;
  }
};

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate file type
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  if (!allowedTypes.includes(file.type)) {
    error.value = 'Format file tidak didukung. Mohon upload file Excel (.xlsx atau .xls).';
    toast.error('Format file tidak didukung');
    event.target.value = '';
    return;
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    error.value = 'Ukuran file terlalu besar. Maksimal 10MB.';
    toast.error('Ukuran file terlalu besar');
    event.target.value = '';
    return;
  }

  isUploading.value = true;
  error.value = '';
  success.value = '';

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000 // 30 second timeout for large files
    });

    success.value = response.data.message || 'File berhasil diunggah dan diproses.';
    toast.success('File berhasil diunggah');
  } catch (err) {
    console.error('Error uploading file:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Gagal mengunggah file.';
    error.value = errorMessage;
    toast.error(errorMessage);
  } finally {
    isUploading.value = false;
    event.target.value = ''; // Reset file input
  }
};

// Watchers
watch(activeTab, () => {
  error.value = '';
  success.value = '';
});

watch(() => category.value.searchTerm, filterCategories);
watch(() => city.value.searchTerm, filterCities);

// Validate year range
watch(() => [templateFilters.startYear, templateFilters.endYear], ([startYear, endYear]) => {
  if (startYear && endYear && startYear > endYear) {
    templateFilters.endYear = startYear;
  }
});

// Auto-clear messages after 5 seconds
watch([error, success], () => {
  if (error.value || success.value) {
    setTimeout(() => {
      error.value = '';
      success.value = '';
    }, 5000);
  }
});

// Lifecycle
onMounted(async () => {
  await fetchCategories();
  // Initialize city filtered list
  city.value.filtered = [...cities];
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
/* Icon styles using Tailwind-compatible approach */
.i-lucide-file-plus,
.i-lucide-upload,
.i-lucide-file-down {
  @apply inline-block w-4 h-4 bg-no-repeat bg-contain align-middle;
}

.i-lucide-file-plus {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z'/%3E%3Cpath d='M12 15v-6'/%3E%3Cpath d='M9 12h6'/%3E%3C/svg%3E");
}

.i-lucide-upload {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/%3E%3Cpolyline points='17 8 12 3 7 8'/%3E%3Cline x1='12' x2='12' y1='3' y2='15'/%3E%3C/svg%3E");
}

.i-lucide-file-down {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z'/%3E%3Cpath d='M12 15V3'/%3E%3Cpath d='m9 12 3 3 3-3'/%3E%3C/svg%3E");
}

/* Custom scrollbar classes - you might need to add these to your Tailwind config */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

.scrollbar-track-gray-100::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

.scrollbar-thin::-webkit-scrollbar {
  @apply w-2;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

.scrollbar-thin::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
