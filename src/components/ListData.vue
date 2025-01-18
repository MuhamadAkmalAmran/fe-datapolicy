<template>
  <div class="w-full p-6 bg-white rounded shadow">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Data {{ selectedDataType }}</h1>
      <button @click="openAddModal" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Tambah Data
      </button>
    </div>

    <!-- Data Filter -->
    <div class="grid gap-6 grid-cols-2 mb-6">
      <div>
        <label class="block text-sm mb-2">Jenis Data</label>
        <select v-model="selectedDataType" class="select select-bordered w-full">
          <option value="">Pilih Jenis Data</option>
          <option v-for="type in dataTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm mb-2">Wilayah</label>
        <select v-model="selectedRegion" class="select select-bordered w-full">
          <option value="">Semua Wilayah</option>
          <option v-for="region in regions" :key="region" :value="region">
            {{ region }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th class="text-left px-4 py-2">Wilayah</th>
            <th class="text-left px-4 py-2">Tahun</th>
            <th class="text-left px-4 py-2">Nilai</th>
            <th class="text-center px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredData" :key="`${item.region}-${item.year}`" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="px-4 py-2">{{ item.region }}</td>
            <td class="px-4 py-2">{{ item.year }}</td>
            <td class="px-4 py-2">{{ formatValue(getDataValue(item)) }}</td>
            <td class="px-4 py-2 text-center">
              <button @click="openEditModal(item)"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Edit
              </button>
              <button @click="confirmDelete(item)"
                class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <dialog :open="showModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">
          {{ isEditing ? 'Edit Data' : 'Tambah Data Baru' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm mb-2">Wilayah</label>
            <select v-model="form.region" class="select select-bordered w-full" :disabled="isEditing">
              <option value="">Pilih Wilayah</option>
              <option v-for="region in regions" :key="region" :value="region">
                {{ region }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-2">Tahun</label>
            <input type="number" v-model="form.year" class="input input-bordered w-full" :disabled="isEditing"
              min="2000" max="2024" />
          </div>
          <div>
            <label class="block text-sm mb-2">Nilai</label>
            <input type="number" v-model="form.value" class="input input-bordered w-full" step="0.01" />
          </div>
          <div class="modal-action">
            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              {{ isEditing ? 'Simpan Perubahan' : 'Tambah Data' }}
            </button>
            <button type="button" @click="closeModal"
              class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
              Batal
            </button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog :open="showDeleteModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Konfirmasi Hapus</h3>
        <p>Apakah Anda yakin ingin menghapus data ini?</p>
        <div class="modal-action">
          <button @click="handleDelete" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
            Hapus
          </button>
          <button @click="showDeleteModal = false" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            Batal
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'DataManagementTable',

  props: {
    initialData: {
      type: Array,
      required: true
    }
  },

  emits: ['update:data'],

  setup(props, { emit }) {
    // State
    const tableData = ref([...props.initialData])
    const selectedDataType = ref('IPM')
    const selectedRegion = ref('')
    const showModal = ref(false)
    const showDeleteModal = ref(false)
    const isEditing = ref(false)
    const itemToDelete = ref(null)
    const form = ref({
      region: '',
      year: new Date().getFullYear(),
      value: 0
    })

    // Constants
    const regions = [
      "Kota Yogyakarta",
      "Kulon Progo",
      "Kota Bandung",
      "Kota Surabaya",
      "Banyuwangi"
    ]

    const dataTypes = ["IPM", "Stunting", "Jumlah Penduduk Miskin", "APBD"]

    // Computed
    const filteredData = computed(() => {
      return tableData.value.filter(item => {
        const regionMatch = !selectedRegion.value || item.region === selectedRegion.value
        return regionMatch
      })
    })

    // Methods
    const getDataValue = (item) => {
      switch (selectedDataType.value) {
        case 'IPM': return item.ipm
        case 'Stunting': return item.stunting
        case 'Jumlah Penduduk Miskin': return item.pendudukMiskin
        case 'APBD': return item.apbd
        default: return null
      }
    }

    const formatValue = (value) => {
      if (typeof value === 'number') {
        return value.toLocaleString('id-ID', {
          maximumFractionDigits: 2
        })
      }
      return value
    }

    const openAddModal = () => {
      isEditing.value = false
      form.value = {
        region: '',
        type: '',
        year: new Date().getFullYear(),
        value: 0
      }
      showModal.value = true
    }

    const openEditModal = (item) => {
      isEditing.value = true
      form.value = {
        region: item.region,
        year: item.year,
        type: item.type,
        value: getDataValue(item)
      }
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      form.value = {
        region: '',
        type: '',
        year: new Date().getFullYear(),
        value: 0
      }
    }

    const handleSubmit = () => {
      if (isEditing.value) {
        const index = tableData.value.findIndex(
          item => item.region === form.value.region && item.year === form.value.year
        )
        if (index !== -1) {
          const updatedItem = { ...tableData.value[index] }
          switch (selectedDataType.value) {
            case 'IPM':
              updatedItem.ipm = form.value.value
              break
            case 'Stunting':
              updatedItem.stunting = form.value.value
              break
            case 'Jumlah Penduduk Miskin':
              updatedItem.pendudukMiskin = form.value.value
              break
            case 'APBD':
              updatedItem.apbd = form.value.value
              break
          }
          tableData.value[index] = updatedItem
        }
      } else {
        const newItem = {
          region: form.value.region,
          year: form.value.year,
          ipm: 0,
          stunting: 0,
          pendudukMiskin: 0,
          apbd: 0
        }
        switch (selectedDataType.value) {
          case 'IPM':
            newItem.ipm = form.value.value
            break
          case 'Stunting':
            newItem.stunting = form.value.value
            break
          case 'Jumlah Penduduk Miskin':
            newItem.pendudukMiskin = form.value.value
            break
          case 'APBD':
            newItem.apbd = form.value.value
            break
        }
        tableData.value.push(newItem)
      }

      emit('update:data', tableData.value)
      closeModal()
    }

    const confirmDelete = (item) => {
      itemToDelete.value = item
      showDeleteModal.value = true
    }

    const handleDelete = () => {
      if (itemToDelete.value) {
        tableData.value = tableData.value.filter(
          item => !(item.region === itemToDelete.value.region &&
            item.year === itemToDelete.value.year)
        )
        emit('update:data', tableData.value)
      }
      showDeleteModal.value = false
      itemToDelete.value = null
    }

    return {
      // State
      tableData,
      selectedDataType,
      selectedRegion,
      showModal,
      showDeleteModal,
      isEditing,
      form,
      regions,
      dataTypes,

      // Computed
      filteredData,

      // Methods
      getDataValue,
      formatValue,
      openAddModal,
      openEditModal,
      closeModal,
      handleSubmit,
      confirmDelete,
      handleDelete
    }
  }
}
</script>
