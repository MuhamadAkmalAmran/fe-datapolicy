<template>
  <div class="w-full">
    <div class="card m-4 rounded bg-white p-5 shadow">
      <h1 class="text-xl font-semibold mb-4">Tambang Prevelensi Stunting</h1>
      <Form class="space-y-4">
        <div class="space-y-2">
            <label class="block text-sm">Kabupaten/Kota</label>
            <select v-model="wilayah" class="select select-bordered w-1/2 max-w-xs">
              <option disabled value="">Pilih Kabupaten/Kota</option>
              <option value="3471">Kota Yogyakarta</option>
              <option value="3401">Kabupaten Kulon Progo</option>
              <option value="3578">Kota Surabya</option>
              <option value="3510">Kabupaten Banyuwangi</option>
              <option value="3273">Kota Bandung</option>
            </select>
          </div>
        <div class="space-y-2">
            <label class="block text-sm">Kabupaten/Kota</label>
            <select v-model="wilayah" class="select select-bordered w-1/2 max-w-xs">
              <option disabled value="">Pilih Kabupaten/Kota</option>
              <option value="3471">Kota Yogyakarta</option>
              <option value="3401">Kabupaten Kulon Progo</option>
              <option value="3578">Kota Surabya</option>
              <option value="3510">Kabupaten Banyuwangi</option>
              <option value="3273">Kota Bandung</option>
            </select>
          </div>
      </Form>
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>
