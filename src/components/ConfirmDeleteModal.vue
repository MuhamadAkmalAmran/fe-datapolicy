<template>
  <div class="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="font-bold text-lg mb-4">Konfirmasi Hapus</h3>
      <p>Apakah Anda yakin ingin menghapus data ini?</p>
      <div class="flex justify-end space-x-2 mt-6">
        <button @click="$emit('confirm')"
          class="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5">
          Hapus
        </button>
        <button @click="$emit('close')"
          class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5">
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['confirm', 'close']);
</script>
