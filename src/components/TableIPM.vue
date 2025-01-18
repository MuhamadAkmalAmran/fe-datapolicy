<template>
  <div v-if="data.length" class="mt-4 overflow-x-auto">
    <h1 class="text-lg font-semibold mb-2">Data Preview</h1>
    <table class="table table-xs min-w-full">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">Tahun</th>
          <th class="border border-gray-300 px-4 py-2">Wilayah</th>
          <th class="border border-gray-300 px-4 py-2">Indeks Pembangunan Manusia (%)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td class="py-2 px-4 border">{{ item.wilayah }}</td>
          <td class="py-2 px-4 border">{{ item.tahun }}</td>
          <td class="py-2 px-4 border">{{ item.data === '413' ? item.data : item.data }}</td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4 space-x-2">
      <button @click="downloadCSV" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Download
        CSV</button>
      <button @click="saveToDatabase" class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">Save to
        Database</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data', 'jenis_data'],
  computed: {
    tableHeaders() {
      const headersMap = {
        '413': ['Wilayah', 'Tahun', 'Jumlah Penduduk Miskin (Ribu)'],
        '619': ['Wilayah', 'Tahun', 'Index Pembangunan Manusia']
      };
      return headersMap[this.data.jenis_data] || [];
    }
  },
  methods: {
    downloadCSV() {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += this.tableHeaders.join(",") + "\n";
      this.data.forEach(item => {
        csvContent += `${item.wilayah},${item.tahun},${item.jenis_data === '413' ? item.jumlah_penduduk : item.ipm}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async saveToDatabase() {
      try {
        const response = await fetch('/save_to_database', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.data)
        });
        if (response.ok) {
          alert("Data berhasil disimpan ke database.");
        } else {
          alert("Gagal menyimpan data ke database.");
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  }
};
</script>
