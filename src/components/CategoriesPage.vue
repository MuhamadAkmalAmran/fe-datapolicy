<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-4">
      <h1 class="text-2xl font-bold mb-4">Master Kategori</h1>
      <div class="flex items-center justify-between">
        <!-- Search Bar -->
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input v-model="searchQuery" type="text" placeholder="Cari kategori..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            @input="handleSearch">
        </div>
        <button @click="openModal()" class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 ml-4">
          Tambah Kategori
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="text-gray-500">Memuat data...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Categories Table -->
    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(category, index) in paginatedCategories" :key="category.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ ((currentPage - 1) * itemsPerPage) + index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ category.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openModal(category)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
              <button @click="confirmDelete(category)" class="text-red-600 hover:text-red-900">Hapus</button>
            </td>
          </tr>
          <tr v-if="filteredCategories.length === 0">
            <td colspan="3" class="px-6 py-4 text-center text-gray-500">
              {{ searchQuery ? 'Tidak ada kategori yang sesuai dengan pencarian' : 'Tidak ada data kategori' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="filteredCategories.length > 0" class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Menampilkan {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage,
          filteredCategories.length) }} dari {{ filteredCategories.length }} hasil
      </div>
      <div class="flex items-center space-x-2">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Sebelumnya
        </button>

        <div class="flex space-x-1">
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
            'px-3 py-1 text-sm border rounded-md',
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
          ]">
            {{ page }}
          </button>
        </div>

        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Selanjutnya
        </button>
      </div>
    </div>

    <!-- Category Modal -->
    <CategoryModal v-if="isModalOpen" :category="currentCategory" :is-editing="isEditing" @save="saveCategory"
      @close="closeModal" />

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal v-if="isDeleteModalOpen" @confirm="handleDeleteCategory" @close="closeDeleteModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/api.js';
import CategoryModal from './CategoryModal.vue';
import ConfirmDeleteModal from './ConfirmDeleteModal.vue';

// Reactive data
const categories = ref([]);
const loading = ref(false);
const error = ref('');
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isEditing = ref(false);
const currentCategory = ref({ id: null, name: '' });
const categoryToDelete = ref(null);

// Search and pagination
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Methods
const fetchCategories = async () => {
  try {
    loading.value = true;
    error.value = '';
    const response = await getCategories();
    categories.value = response.data || [];
  } catch (err) {
    error.value = 'Gagal memuat data kategori';
    console.error('Error fetching categories:', err);
  } finally {
    loading.value = false;
  }
};

const openModal = (category = null) => {
  if (category) {
    isEditing.value = true;
    currentCategory.value = { ...category };
  } else {
    isEditing.value = false;
    currentCategory.value = { id: null, name: '' };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveCategory = async (categoryData) => {
  try {
    if (isEditing.value) {
      await updateCategory(currentCategory.value.id, categoryData);
    } else {
      await createCategory(categoryData);
    }
    await fetchCategories();
    closeModal();
  } catch (err) {
    error.value = isEditing.value ? 'Gagal mengupdate kategori' : 'Gagal menambah kategori';
    console.error('Error saving category:', err);
  }
};

const confirmDelete = (category) => {
  categoryToDelete.value = category;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  categoryToDelete.value = null;
};

const handleDeleteCategory = async () => {
  try {
    await deleteCategory(categoryToDelete.value.id);
    await fetchCategories();
    closeDeleteModal();
  } catch (err) {
    error.value = 'Gagal menghapus kategori';
    console.error('Error deleting category:', err);
  }
};

// Computed properties
const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return categories.value;
  }

  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCategories.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredCategories.value.length / itemsPerPage.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }

  return pages;
});

// Methods
const handleSearch = () => {
  currentPage.value = 1; // Reset to first page when searching
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

// Lifecycle
onMounted(() => {
  fetchCategories();
});
</script>
