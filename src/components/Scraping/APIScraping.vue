<script>
import DataTable from './DataTable.vue';
import TableIPM from '../TableIPM.vue';
import { ref } from 'vue';

export default {
  components: {
    DataTable,
    TableIPM,
  },
  data() {
    return {
      fetchedData: ref([]),
      wilayah: ref(''),
      jenis_data: ref(''),
      // jumlah_penduduk: '',
      tahun: ref(''),
    };
  },
  computed: {
    tableHeaders() {
      if (this.jenis_data === '413') {
        return ['Wilayah', 'Tahun', 'Jumlah Penduduk Miskin (Ribuan)'];
      }
      if (this.jenis_data === '619') {
        return ['Wilayah', 'Tahun', 'Index Pembangunan Manusia'];
      }
      return ['Wilayah', 'Tahun', 'Jumlah Penduduk (Ribuan)'];
    }
  },
  methods: {
    async fetchData() {
      try {
        const params = {
          wilayah: this.wilayah,
          jenis_data: this.jenis_data,
          tahun: this.tahun
        };
        const response = await fetch('http://127.0.0.1:5000/fetch_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        });
        if (response.ok) {
          const data = await response.data.json();
          this.fetchedData = data.data
        } else {
          alert("Gagal mengambil data. Silakan cek input.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  }
};
</script>


<template>
  <div class="w-full">
    <div class="card m-2 p-5 shadow bg-white rounded">
      <h1 class="text-lg mb-4 font-semibold">API Scrap</h1>
      <form @submit.prevent="fetchData" class="space-y-4">
        <div>
          <label class="block text-sm pb-1">Jenis Data</label>
          <select v-model="jenis_data" class="select select-bordered w-1/2 max-w-xs">
            <option disabled value="">Pilih Jenis Data</option>
            <option value="413">Jumlah Penduduk Miskin</option>
            <option value="619">Index Pembangunan Manusia</option>
          </select>
        </div>
        <div>
          <label class="block text-sm pb-1">Kabupaten/Kota</label>
          <select v-model="wilayah" class="select select-bordered w-1/2 max-w-xs">
            <option disabled value="">Pilih Kabupaten/Kota</option>
            <option value="3471">Kota Yogyakarta</option>
            <option value="3401">Kabupaten Kulon Progo</option>
            <option value="3578">Kota Surabya</option>
            <option value="3510">Kabupaten Banyuwangi</option>
            <option value="3273">Kota Bandung</option>
          </select>
        </div>
        <div>
          <label class="block text-sm pb-1">Tahun</label>
          <select v-model="tahun" class="select select-bordered w-1/2 max-w-xs">
            <option disabled value="">Pilih Tahun</option>
            <option value="120">2020</option>
            <option value="121">2021</option>
            <option value="122">2022</option>
            <option value="123">2023</option>
            <option value="124">2024</option>
            <option value="120:124">5 tahun</option>
            <option value="115:124">10 tahun</option>
          </select>
        </div>
        <button type="submit" class="btn btn-info text-white">Scrap Data</button>
      </form>
    </div>
    <div class="card m-2 p-5 shadow rounded bg-white">
      <TableIPM v-if="jenis_data === '619' && fetchedData.length" :data="fetchedData" />
      <DataTable v-else-if="fetchedData.length" :data="fetchedData" />
    </div>
  </div>
</template>
