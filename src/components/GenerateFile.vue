<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <h2 class="text-2xl font-semibold mb-2">Pengelolaan Data</h2>
        <p class="text-gray-600 mb-6">
          Pilih metode untuk menambahkan data baru ke sistem
        </p>

        <!-- Tabs -->
        <div class="w-full">
          <div class="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              @click="activeTab = 'manual'"
              :class="[
                'flex items-center justify-center gap-2 p-2 rounded-md transition-colors',
                activeTab === 'manual' ? 'bg-white shadow' : 'hover:bg-gray-200'
              ]"
            >
              <i class="i-lucide-file-plus w-4 h-4"></i>
              Input Manual
            </button>
            <button
              @click="activeTab = 'import'"
              :class="[
                'flex items-center justify-center gap-2 p-2 rounded-md transition-colors',
                activeTab === 'import' ? 'bg-white shadow' : 'hover:bg-gray-200'
              ]"
            >
              <i class="i-lucide-upload w-4 h-4"></i>
              Import CSV
            </button>
          </div>

          <!-- Alert Messages -->
          <div v-if="error || success"
            :class="[
              'mb-6 p-4 rounded-lg',
              error ? 'bg-red-50' : 'bg-green-50'
            ]"
          >
            <p :class="error ? 'text-red-800' : 'text-green-800'">
              {{ error || success }}
            </p>
          </div>

          <!-- Manual Input Form -->
          <div v-if="activeTab === 'manual'">
            <form @submit.prevent="handleManualSubmit" class="space-y-6">
              <!-- Jenis Data -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Kategori <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.category_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  @change="loadCategoryFields"
                >
                  <option disabled value="">Pilih Kategori</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Wilayah -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Kabupaten/Kota <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.city"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option disabled value="">Pilih wilayah</option>
                  <option v-for="city in cities" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
              </div>

              <!-- Tahun -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Periode Data <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  v-model="form.year"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="2000"
                  max="2025"
                  required
                />
              </div>

              <!-- Dynamic Fields based on Category -->
              <div v-if="categoryFields.length > 0" class="space-y-4">
                <div v-for="(field, index) in categoryFields" :key="index" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    {{ field.label }} <span v-if="field.required" class="text-red-500">*</span>
                  </label>

                  <!-- Text input -->
                  <input
                    v-if="field.type === 'text'"
                    type="text"
                    v-model="form.fields[field.name]"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :required="field.required"
                  />

                  <!-- Number input -->
                  <input
                    v-else-if="field.type === 'number'"
                    type="number"
                    v-model="form.fields[field.name]"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :step="field.step || '0.01'"
                    :min="field.min"
                    :max="field.max"
                    :required="field.required"
                  />

                  <!-- Select input -->
                  <select
                    v-else-if="field.type === 'select'"
                    v-model="form.fields[field.name]"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :required="field.required"
                  >
                    <option disabled value="">Pilih {{ field.label }}</option>
                    <option v-for="option in field.options" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>

                  <!-- Date input -->
                  <input
                    v-else-if="field.type === 'date'"
                    type="date"
                    v-model="form.fields[field.name]"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :required="field.required"
                  />

                  <p v-if="field.description" class="text-xs text-gray-500 mt-1">
                    {{ field.description }}
                  </p>
                </div>
              </div>

              <!-- Nilai -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Nilai <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  v-model="form.amount"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                  required
                />
              </div>

              <!-- Submit Button -->
              <div class="pt-4">
                <button
                  type="submit"
                  :disabled="isLoading"
                  :class="[
                    'w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                    !isLoading
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
                    Memproses...
                  </span>
                  <span v-else>
                    Simpan Data
                  </span>
                </button>
              </div>
            </form>
          </div>

          <!-- Import CSV -->
          <div v-if="activeTab === 'import'" class="space-y-6">
            <!-- Template Generator Form -->
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 class="font-medium text-gray-700 mb-3">Generate Template CSV</h3>

              <div class="space-y-4">
                <!-- Kategori untuk Template -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Kategori <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="templateForm.category_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option disabled value="">Pilih Kategori</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Pilih Wilayah (Multiple) -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Wilayah
                    </label>
                    <div class="border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto">
                      <div v-for="city in cities" :key="city" class="flex items-center mb-1">
                        <input
                          type="checkbox"
                          :id="'city-' + city"
                          v-model="templateForm.selectedCities"
                          :value="city"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label :for="'city-' + city" class="ml-2 text-sm text-gray-700">
                          {{ city }}
                        </label>
                      </div>
                    </div>
                    <p class="text-xs text-gray-500">
                      Tidak ada pilihan = Semua wilayah
                    </p>
                  </div>

                  <!-- Tahun Range -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Tahun
                    </label>
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="text-xs text-gray-600">Dari</label>
                        <input
                          type="number"
                          v-model="templateForm.yearStart"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="2000"
                          max="2025"
                        />
                      </div>
                      <div>
                        <label class="text-xs text-gray-600">Sampai</label>
                        <input
                          type="number"
                          v-model="templateForm.yearEnd"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="2000"
                          max="2025"
                        />
                      </div>
                    </div>
                    <p class="text-xs text-gray-500">
                      Kosong = Tahun saat ini
                    </p>
                  </div>
                </div>

                <!-- Generate Button -->
                <button
                  @click="downloadTemplate"
                  :disabled="isGeneratingTemplate || !templateForm.category_id"
                  class="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <span v-if="isGeneratingTemplate">
                    <svg class="inline w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <i class="i-lucide-file-down w-4 h-4"></i>
                    Download Template CSV
                  </span>
                </button>
              </div>
            </div>

            <!-- File Upload Area -->
            <div class="border-2 border-dashed rounded-lg p-6 text-center">
              <label class="cursor-pointer block">
                <div class="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors">
                  <i class="i-lucide-upload w-12 h-12 mx-auto text-gray-400 mb-4"></i>
                  <p class="text-sm text-gray-600 mb-2">
                    Klik atau seret file CSV ke sini
                  </p>
                  <p class="text-xs text-gray-500">
                    Format yang didukung: CSV
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  @change="handleFileUpload"
                  class="hidden"
                />
              </label>
            </div>

            <!-- Upload Progress -->
            <div v-if="isUploading" class="mt-4">
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: uploadProgress + '%' }"></div>
              </div>
              <p class="text-sm text-gray-600 mt-2 text-center">{{ uploadProgress }}% Terupload</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';

const activeTab = ref('manual');
const isLoading = ref(false);
const isGeneratingTemplate = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);

const form = reactive({
  amount: '',
  year: new Date().getFullYear(),
  city: '',
  category_id: '',
  fields: {}
});

const templateForm = reactive({
  category_id: '',
  selectedCities: [],
  yearStart: new Date().getFullYear(),
  yearEnd: new Date().getFullYear()
});

const categories = ref([]);
const categoryFields = ref([]);
const error = ref('');
const success = ref('');

const cities = [
  "Kota Yogyakarta",
  "Kulon Progo",
  "Kota Bandung",
  "Kota Surabaya",
  "Banyuwangi"
];

const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/categories');
    const data = await response.json();
    categories.value = data;
  } catch (err) {
    error.value = 'Gagal memuat kategori: ' + err.message;
  }
};

const loadCategoryFields = async () => {
  if (!form.category_id) {
    categoryFields.value = [];
    form.fields = {};
    return;
  }

  isLoading.value = true;
  try {
    const response = await fetch(`http://localhost:5000/api/categories/${form.category_id}/fields`);
    if (!response.ok) throw new Error('Gagal memuat kolom kategori');

    const data = await response.json();
    categoryFields.value = data;

    // Initialize form fields object
    form.fields = {};
    categoryFields.value.forEach(field => {
      form.fields[field.name] = field.default || '';
    });
  } catch (err) {
    error.value = 'Gagal memuat kolom kategori: ' + err.message;
    categoryFields.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleManualSubmit = async () => {
  isLoading.value = true;
  error.value = '';
  success.value = '';

  try {
    // Combine base form data with dynamic fields
    const formData = {
      ...form,
      fields: form.fields
    };

    const response = await fetch('http://localhost:5000/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal menyimpan data');
    }

    success.value = 'Data berhasil ditambahkan';
    form.amount = '';
    form.fields = {};

    // Reset dynamic fields
    categoryFields.value.forEach(field => {
      form.fields[field.name] = field.default || '';
    });

    // Keep current category, city and year for convenience
  } catch (err) {
    error.value = err.message || 'Gagal menyimpan data';
  } finally {
    isLoading.value = false;
  }
};

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  isUploading.value = true;
  uploadProgress.value = 0;
  error.value = '';
  success.value = '';

  const formData = new FormData();
  formData.append('file', file);

  try {
    // Simulate progress upload
    const interval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 300);

    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData
    });

    clearInterval(interval);
    uploadProgress.value = 100;

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mengimpor data');
    }

    success.value = 'File berhasil diimpor';
    event.target.value = '';

    // Wait a bit before hiding the progress bar
    setTimeout(() => {
      isUploading.value = false;
    }, 1000);
  } catch (err) {
    error.value = err.message || 'Gagal mengimpor file';
    isUploading.value = false;
  }
};

const downloadTemplate = async () => {
  isGeneratingTemplate.value = true;
  error.value = '';
  success.value = '';

  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('category_id', templateForm.category_id);

    if (templateForm.selectedCities.length > 0) {
      templateForm.selectedCities.forEach(city => {
        params.append('cities', city);
      });
    }

    if (templateForm.yearStart) {
      params.append('year_start', templateForm.yearStart);
    }

    if (templateForm.yearEnd) {
      params.append('year_end', templateForm.yearEnd);
    }

    const response = await fetch(`http://localhost:5000/api/export-template?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mengunduh template');
    }

    const blob = await response.blob();
    const fileName = response.headers.get('content-disposition')?.split('filename=')[1] || `template-${templateForm.category_id}.csv`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    success.value = 'Template CSV berhasil diunduh';
  } catch (err) {
    error.value = 'Gagal mengunduh template: ' + err.message;
  } finally {
    isGeneratingTemplate.value = false;
  }
};

// Validasi form template
watch(() => templateForm.yearStart, (newValue) => {
  if (newValue > templateForm.yearEnd) {
    templateForm.yearEnd = newValue;
  }
});

watch(() => templateForm.yearEnd, (newValue) => {
  if (newValue < templateForm.yearStart) {
    templateForm.yearStart = newValue;
  }
});

// Reset alerts when tab changes
watch(activeTab, () => {
  error.value = '';
  success.value = '';
});

onMounted(() => {
  fetchCategories();
});
</script>
