<script>
import TableAPBD from './TableAPBD.vue';

export default {
  components: {
    TableAPBD
  },
  data() {
    return {
      fetchedData: [],
      city: '',
      type: '',
      amount: '',
      year: '',
      file: null,
    };
  },
  methods: {
    async fetchData() {
      try {
        const formData = new FormData();
        formData.append("city", this.city);
        formData.append("type", this.type);
        formData.append("year", this.year);
        formData.append("amount", this.amount);
        if (this.file) {
          formData.append("file", this.file);
        }

        const response = await fetch('http://127.0.0.1:5000/apbd', {
          method: 'POST',
          body: formData, // Langsung gunakan FormData
        });

        if (response.ok) {
          const data = await response.json();
          this.fetchedData = [data.data]; // Tambahkan data baru ke tabel
          alert("Data berhasil disimpan!");
        } else {
          const error = await response.json();
          alert(`Gagal menyimpan data: ${error.message}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Terjadi kesalahan saat menyimpan data.");
      }
    },
    handleFileUpload(event) {
      this.file = event.target.files[0]; // Tangkap file yang dipilih
    },
  }
};
</script>


<template>
  <div class="w-full">
    <div class="h-full m-2 p-5 bg-white rounded">
      <h1 class="text-lg mb-4 font-semibold">PDF Scrap</h1>
      <form @submit.prevent="fetchData" class="space-y-4">
        <div>
          <label class="block text-sm pb-1">Kabupaten/Kota</label>
          <select v-model="city" class="select select-bordered w-1/2 max-w-xs">
            <option disabled value="">Pilih Kabupaten/Kota</option>
            <option value="Kota Yogyakarta">Kota Yogyakarta</option>
            <option value="Kulon Progo">Kabupaten Kulon Progo</option>
            <option value="Kota Surabaya">Kota Surabaya</option>
            <option value="Banyuwangi">Kabupaten Banyuwangi</option>
            <option value="Kota Bandung">Kota Bandung</option>
          </select>
        </div>
        <div>
          <label class="block text-sm pb-1">Jenis APBD</label>
          <select v-model="type" class="select select-bordered w-1/2 max-w-xs">
            <option disabled value="">Pilih Jenis</option>
            <option value="Indeks Pembangunan Manusia">Indeks Pembangunan Manusia</option>
            <option value="Kemiskinan">Kemiskinan</option>
            <option value="Stunting">Stunting</option>
          </select>
        </div>
        <div>
          <label class="block text-sm pb-1">Tahun</label>
          <input type="year" placeholder="Contoh: 2020" v-model="year"
            class="input input-bordered  w-full max-w-xs" />
        </div>
        <div>
          <label class="block text-sm pb-1">Jumlah Anggaran</label>
          <input type="number" placeholder="Contoh: 100000" v-model="amount"
            class="input input-bordered  w-full max-w-xs" />
        </div>
        <div>
          <label class="block text-sm pb-1">APBD</label>
          <input type="file" name="file" @change="handleFileUpload"
            class="file-input file-input-bordered w-full max-w-xs" />
        </div>
        <button type="submit" class="btn btn-info text-white">Simpan</button>
      </form>

      <TableAPBD v-if="fetchedData.length" :data="fetchedData" :headers="tableHeaders" />
    </div>
  </div>
</template>
