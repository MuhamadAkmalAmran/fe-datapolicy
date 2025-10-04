<template>
  <div class="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="font-bold text-lg mb-4">{{ isEditing ? 'Edit Kategori' : 'Tambah Kategori' }}</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Nama Kategori <span class="text-red-500">*</span>
          </label>
          <input v-model="formData.name" type="text" id="name" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.name }" placeholder="Masukkan nama kategori">
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>



        <div class="flex justify-end space-x-2 mt-6">
          <button type="button" @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Batal
          </button>
          <button type="submit" :disabled="loading"
            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isEditing ? 'Menyimpan...' : 'Menambah...' }}
            </span>
            <span v-else>{{ isEditing ? 'Simpan' : 'Tambah' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue';

const props = defineProps({
  category: {
    type: Object,
    default: () => ({ id: null, name: '', description: '', active: true })
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['save', 'close']);

const loading = ref(false);
const errors = ref({});

const formData = ref({
  name: ''
});

// Watch for changes in the category prop to update form data
watch(() => props.category, (newCategory) => {
  formData.value = {
    name: newCategory.name || ''
  };
}, { immediate: true, deep: true });

// Validation function
const validateForm = () => {
  errors.value = {};

  if (!formData.value.name.trim()) {
    errors.value.name = 'Nama kategori wajib diisi';
  } else if (formData.value.name.trim().length < 2) {
    errors.value.name = 'Nama kategori minimal 2 karakter';
  }

  return Object.keys(errors.value).length === 0;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    // Emit the save event with form data
    emit('save', {
      name: formData.value.name.trim()
    });
  } catch (error) {
    console.error('Error in modal:', error);
  } finally {
    loading.value = false;
  }
};
</script>
