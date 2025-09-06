<template>
  <div class="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="font-bold text-lg mb-4">{{ isEditing ? 'Edit Data' : 'Tambah Data Baru' }}</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm mb-2">Wilayah</label>
          <select v-model="form.city" class="select select-bordered w-full" required>
            <option value="" disabled>Pilih Wilayah</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm mb-2">Kategori</label>
          <select v-model="form.category_id" class="select select-bordered w-full" required>
            <option value="" disabled>Pilih Kategori</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm mb-2">Tahun</label>
          <input type="number" v-model="form.year" class="input input-bordered w-full" required min="2000" max="2024" />
        </div>
        <div>
          <label class="block text-sm mb-2">Nilai</label>
          <input type="number" v-model="form.amount" class="input input-bordered w-full" step="0.01" required />
        </div>
        <div class="flex justify-end space-x-2 mt-4">
          <button type="submit" :disabled="isSubmitting"
            class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-gray-400">
            {{ isEditing ? 'Ubah' : 'Tambah' }}
          </button>
          <button type="button" @click="$emit('close')"
            class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5">
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { CITIES } from '@/constants';

const props = defineProps({
  initialData: Object,
  categories: Array,
  isEditing: Boolean,
  isSubmitting: Boolean,
});

const emit = defineEmits(['submit', 'close']);

const form = ref({});
const cities = CITIES;

// Tonton perubahan pada initialData untuk mengisi form
watch(() => props.initialData, (newData) => {
  form.value = { ...newData };
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', form.value);
};
</script>
