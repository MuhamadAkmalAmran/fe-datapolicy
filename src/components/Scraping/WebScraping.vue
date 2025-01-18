<template>
  <div class="w-full">
    <div class=" h-full m-2 p-5 bg-white rounded">
      <h1 class="text-lg mb-4 font-semibold">Stunting Scraping</h1>
      <form @submit.prevent="fetchData" class="space-y-4">
        <!-- <div>
          <label class="block text-sm pb-1">Jenis Data</label>
          <select v-model="jenis_data" class="select select-bordered w-1/2 max-w-xs">
            <option disabled value="">Pilih Jenis Data</option>
            <option value="413">Jumlah Penduduk Miskin</option>
            <option value="619">Index Pembangunan Manusia</option>
            <option value="619">Prevelensi Stunting</option>
          </select>
        </div> -->
        <div>
          <label class="block text-sm pb-1">Kabupaten/Kota</label>
          <select v-model="kab_kota" class="select select-bordered w-1/2 max-w-xs">
            <option disabled value="">Pilih Kabupaten/Kota</option>
            <option value="Kota Yogyakarta">Kota Yogyakarta</option>
            <option value="Kulon Progo">Kabupaten Kulon Progo</option>
            <option value="Kota Surabaya">Kota Surabaya</option>
            <option value="Banyuwangi">Kabupaten Banyuwangi</option>
            <option value="Kota Bandung">Kota Bandung</option>
          </select>
        </div>
        <div>
          <label class="block text-sm pb-1">Tahun</label>
          <select v-model="year" class="select select-bordered w-1/2 max-w-xs">
            <option disabled value="">Pilih Tahun</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <!-- <option value="120:124">5 tahun</option>
            <option value="115:124">10 tahun</option> -->
          </select>
        </div>
        <button type="submit" class="btn btn-info text-white">Scrap
          Data</button>
      </form>

      <!-- <DataTable v-if="fetchedData.length" :data="fetchedData" :headers="tableHeaders" /> -->
       <div class="mt-2">
        <TableStunting v-if="fetchedData.length" :data="fetchedData" />
       </div>
    </div>
  </div>
</template>

<script>
import TableStunting from '../TableStunting.vue';

export default {
  components: {
    TableStunting,
  },
  data() {
    return {
      fetchedData: [],
      kab_kota: '',
      // jenis_data: '',
      // jumlah_penduduk: '',
      year: ''
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
          kab_kota: this.kab_kota,
          year: this.year
        };
        const response = await fetch('http://127.0.0.1:5000/stunting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        });
        if (response.ok) {
          this.fetchedData = await response.json();
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
