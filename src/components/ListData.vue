<template>
  <div class="w-full shadow p-10 bg-white">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div class="bg-white rounded">
      <h1 class="text-2xl font-semibold mb-6">List Data</h1>

      <!-- Filters -->
      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 mb-6">
        <!-- Kategori dengan Search -->
        <div class="relative" ref="categoryDropdownRef">
          <label class="block text-sm pb-1">Kategori</label>
          <div class="relative">
            <input type="text" v-model="filters.categorySearch" @focus="openCategoryDropdown"
              placeholder="Semua Kategori"
              class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" />
            <!-- Clear button -->
            <button v-if="filters.categorySearch" type="button" @click="clearCategory"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <!-- Category Dropdown -->
          <div v-if="categoryDropdown.open"
            class="absolute w-full bg-white border border-gray-300 mt-1 max-h-72 overflow-y-auto rounded-md shadow-lg z-10">
            <div @click="selectCategory({ id: '', name: 'Semua Kategori' })"
              class="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
              :class="{ 'bg-blue-50': !filters.selectedCategory }">
              Semua Kategori
            </div>
            <div v-for="category in categoryDropdown.filtered" :key="category.id" @click="selectCategory(category)"
              class="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
              :class="{ 'bg-blue-50': filters.selectedCategory === category.id }">
              {{ category.name }}
            </div>
            <div v-if="categoryDropdown.filtered.length === 0" class="px-3 py-2 text-gray-500 text-sm">
              Tidak ada kategori ditemukan
            </div>
          </div>
        </div>

        <!-- Wilayah -->
        <div>
          <label class="block text-sm font-medium text-gray-700 pb-1">Wilayah</label>
          <select v-model="filters.selectedCity"
            class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Semua Wilayah</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-black">
          <thead class="text-xs text-gray-700 font-bold uppercase bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left">Wilayah</th>
              <th class="px-6 py-3 text-left">Tahun</th>
              <th class="px-6 py-3 text-left">Nilai</th>
              <th class="px-6 py-3 text-left">Kategori</th>
              <th class="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in tableData" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">{{ item.city }}</td>
              <td class="px-6 py-4">{{ item.year }}</td>
              <td class="px-6 py-4">{{ item.amount }} {{ getUnit(item.category?.name) }}</td>
              <td class="px-6 py-4">{{ item.category?.name }}</td>
              <td class="px-6 py-4 space-x-2">
                <button @click="openEditModal(item)" class="text-blue-600 hover:text-blue-900" title="Edit">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                    </path>
                  </svg>
                </button>
                <button @click="confirmDelete(item)" class="text-red-600 hover:text-red-900" title="Hapus">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                    </path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modals -->
      <DataFormModal v-if="modal.showForm" :initial-data="modal.formData" :categories="categories"
        :is-editing="modal.isEditing" :is-submitting="isSubmitting" @submit="handleSubmit" @close="closeModal" />

      <ConfirmDeleteModal v-if="modal.showDelete" @confirm="handleDelete" @close="modal.showDelete = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { getData, getCategories, addData, updateData, deleteData } from '@/api/api';
import { CITIES } from '@/constants';
import { getUnit } from '@/utils/formatters';
import DataFormModal from './DataFormModal.vue';
import ConfirmDeleteModal from './ConfirmDeleteModal.vue';

// State
const toast = useToast();
const isLoading = ref(false);
const isSubmitting = ref(false);
const categoryDropdownRef = ref(null);

// Data
const tableData = ref([]);
const categories = ref([]);
const itemToDelete = ref(null);

// Filters
const filters = ref({
  selectedCategory: '',
  selectedCity: '',
  categorySearch: 'Semua Kategori'
});

// Category Dropdown
const categoryDropdown = ref({
  open: false,
  filtered: []
});

// Modal State
const modal = ref({
  showForm: false,
  showDelete: false,
  isEditing: false,
  formData: {}
});

// Constants
const cities = CITIES;
const defaultFormState = {
  amount: 0,
  year: new Date().getFullYear(),
  city: '',
  category_id: null
};

// Computed
const filteredCategories = computed(() => {
  if (!filters.value.categorySearch || filters.value.categorySearch === 'Semua Kategori') {
    return categories.value;
  }
  const term = filters.value.categorySearch.toLowerCase();
  return categories.value.filter(cat =>
    cat.name.toLowerCase().includes(term)
  );
});

// Methods
const fetchData = async () => {
  isLoading.value = true;
  try {
    const params = {};
    if (filters.value.selectedCity) params.city = filters.value.selectedCity;
    if (filters.value.selectedCategory) params.category_id = filters.value.selectedCategory;

    const response = await getData(params);
    tableData.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error('Gagal memuat data');
  } finally {
    isLoading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const response = await getCategories();
    categories.value = response.data;
    categoryDropdown.value.filtered = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const filterCategories = () => {
  categoryDropdown.value.filtered = filteredCategories.value;
};

const selectCategory = (category) => {
  if (category.id === '') {
    filters.value.selectedCategory = '';
    filters.value.categorySearch = 'Semua Kategori';
  } else {
    filters.value.selectedCategory = category.id;
    filters.value.categorySearch = category.name;
  }
  closeCategoryDropdown();
};

const clearCategory = () => {
  filters.value.selectedCategory = '';
  filters.value.categorySearch = '';
  categoryDropdown.value.filtered = categories.value;
};

const openCategoryDropdown = () => {
  categoryDropdown.value.open = true;
  filterCategories();
};

const closeCategoryDropdown = () => {
  categoryDropdown.value.open = false;
};

const handleClickOutside = (event) => {
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(event.target)) {
    closeCategoryDropdown();
  }
};

const handleSubmit = async (submittedForm) => {
  isSubmitting.value = true;
  try {
    if (modal.value.isEditing) {
      await updateData(submittedForm.id, submittedForm);
      toast.success('Data berhasil diperbarui');
    } else {
      await addData(submittedForm);
      toast.success('Data berhasil ditambahkan');
    }
    await fetchData();
    closeModal();
  } catch (error) {
    console.error('Error submitting data:', error);
    toast.error('Gagal menyimpan data');
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  if (itemToDelete.value) {
    try {
      await deleteData(itemToDelete.value.id);
      toast.success('Data berhasil dihapus');
      await fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Gagal menghapus data');
    } finally {
      modal.value.showDelete = false;
      itemToDelete.value = null;
    }
  }
};

const openAddModal = () => {
  modal.value.isEditing = false;
  modal.value.formData = { ...defaultFormState };
  modal.value.showForm = true;
};

const openEditModal = (item) => {
  modal.value.isEditing = true;
  modal.value.formData = { ...item };
  modal.value.showForm = true;
};

const closeModal = () => {
  modal.value.showForm = false;
};

const confirmDelete = (item) => {
  itemToDelete.value = item;
  modal.value.showDelete = true;
};

// Watchers
watch([() => filters.value.selectedCity, () => filters.value.selectedCategory], fetchData);
watch(() => filters.value.categorySearch, filterCategories);

// Lifecycle
onMounted(() => {
  fetchCategories();
  fetchData();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Expose methods for parent component if needed
defineExpose({
  openAddModal,
  fetchData
});
</script>
