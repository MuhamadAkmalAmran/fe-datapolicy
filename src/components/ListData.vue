<script>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification';
// import AddButton from './Button/AddButton.vue';

export default {
  components: {
    // AddButton,
  },
  name: 'ListData',

  setup() {
    // State
    const toast = useToast();
    const tableData = ref([])
    const categories = ref([])
    const selectedCategory = ref('')
    const selectedCity = ref('')
    const showModal = ref(false)
    const showDeleteModal = ref(false)
    const isEditing = ref(false)
    const isLoading = ref(false)
    const itemToDelete = ref(null)
    const form = ref({
      amount: 0,
      year: new Date().getFullYear(),
      city: '',
      category_id: null
    })

    // Constants
    const cities = [
      "Kota Yogyakarta",
      "Kulon Progo",
      "Kota Bandung",
      "Kota Surabaya",
      "Banyuwangi"
    ]

    // API calls
    const fetchData = async () => {
      isLoading.value = true
      try {
        const params = {}
        if (selectedCity.value) params.city = selectedCity.value
        if (selectedCategory.value) params.category_id = selectedCategory.value
        const response = await axios.get('http://localhost:5000/api/data', { params })
        tableData.value = response.data
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Gagal memuat data')
      } finally {
        isLoading.value = false
      }
    }

    const fetchCategories = async () => {
      isLoading.value = true
      try {
        const response = await axios.get('http://localhost:5000/api/categories')
        categories.value = response.data
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        isLoading.value = false
      }
    }

    // Methods
    const handleSubmit = async () => {
      try {
        if (isEditing.value) {
          await axios.put(`http://localhost:5000/api/data/${form.value.id}`, form.value)
          toast.success('Data berhasil diperbarui')
        } else {
          await axios.post('http://localhost:5000/api/data', form.value)
          toast.success('Data berhasil ditambahkan')
        }
        await fetchData()
        closeModal()
      } catch (error) {
        console.error('Error submitting data:', error)
        toast.error('Gagal menyimpan data')
      }
    }

    const handleDelete = async () => {
      if (itemToDelete.value) {
        try {
          await axios.delete(`http://localhost:5000/api/data/${itemToDelete.value.id}`)
          await fetchData()
          showDeleteModal.value = false
          itemToDelete.value = null
          toast.success('Data berhasil dihapus')
        } catch (error) {
          console.error('Error deleting data:', error)
          toast.error('Gagal menghapus data')
        }
      }
    }

    const openAddModal = () => {
      isEditing.value = false
      form.value = {
        amount: 0,
        year: new Date().getFullYear(),
        city: '',
        category_id: null
      }
      showModal.value = true
    }

    const openEditModal = (item) => {
      isEditing.value = true
      form.value = { ...item }
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      form.value = {
        amount: 0,
        year: new Date().getFullYear(),
        city: '',
        category_id: null
      }
    }

    const confirmDelete = (item) => {
      itemToDelete.value = item
      showDeleteModal.value = true
    }

    const getUnit = (categoryName) => {
      switch (categoryName) {
        case 'Indeks Pembangunan Manusia':
        case 'Prevalensi Stunting':
          return '%';
        case 'Jumlah Penduduk Miskin':
          return 'Ribu';
        case 'APBD':
          return 'Miliar';
        default:
          return '';
      }
    };

    // Watchers
    watch([selectedCity, selectedCategory], () => {
      fetchData()
    })

    // Lifecycle hooks
    onMounted(() => {
      fetchCategories()
      fetchData()
    })

    return {
      tableData,
      categories,
      getUnit,
      selectedCategory,
      selectedCity,
      showModal,
      showDeleteModal,
      isEditing,
      isLoading,
      form,
      cities,
      handleSubmit,
      handleDelete,
      openAddModal,
      openEditModal,
      closeModal,
      confirmDelete
    }
  }
}
</script>

<template>
  <div class="w-full shadow p-10 bg-white">
    <!-- Loading spinner -->
    <div v-if="isLoading" class="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div class="bg-white rounded">
      <!-- <div class="flex flex-row justify-between mb-6">
        <h1 class="text-2xl font-semibold">Daftar Data</h1>
        <button @click="openAddModal" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Tambah Data
        </button>
      </div> -->

      <!-- Filters -->
      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 mb-6">
        <div>
          <label class="block text-sm pb-1">Kategori</label>
          <select v-model="selectedCategory" class="select select-bordered w-full">
            <option value="">Semua Kategori</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm pb-1">Wilayah</label>
          <select v-model="selectedCity" class="select select-bordered w-full">
            <option value="">Semua Wilayah</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-black">
          <thead class="text-xs text-gray-700 font-bold uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Wilayah</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Tahun</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Nilai</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Kategori</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in tableData" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{{ item.city }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.year }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.amount }} {{ getUnit(item.category?.name) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.category?.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap space-x-2">
                <button @click="openEditModal(item)" class="text-blue-600 hover:text-blue-900" title="Edit">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                    </path>
                  </svg>
                </button>
                <button @click="confirmDelete(item)" class="text-red-600 hover:text-red-900" title="Hapus">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
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

      <!-- Add/Edit Modal -->
      <div v-if="showModal"
        class="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="font-bold text-lg mb-4">
            {{ isEditing ? 'Edit Data' : 'Tambah Data Baru' }}
          </h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm mb-2">Wilayah</label>
              <select v-model="form.city" class="select select-bordered w-full" required>
                <option value="" disabled>Pilih Wilayah</option>
                <option v-for="city in cities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm mb-2">Kategori</label>
              <select v-model="form.category_id" class="select select-bordered w-full" required>
                <option value="" disabled>Pilih Kategori</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm mb-2">Tahun</label>
              <input type="number" v-model="form.year" class="input input-bordered w-full" required min="2000"
                max="2024" />
            </div>
            <div>
              <label class="block text-sm mb-2">Nilai</label>
              <input type="number" v-model="form.amount" class="input input-bordered w-full" step="0.01" required />
            </div>
            <div class="flex justify-end space-x-2 mt-4">
              <button type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                {{ isEditing ? 'Ubah' : 'Tambah' }}
              </button>
              <button type="button" @click="closeModal"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal"
        class="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="font-bold text-lg mb-4">Konfirmasi Hapus</h3>
          <p>Apakah Anda yakin ingin menghapus data ini?</p>
          <div class="flex justify-end space-x-2 mt-6">
            <button @click="handleDelete"
              class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5">
              Hapus
            </button>
            <button @click="showDeleteModal = false"
              class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
