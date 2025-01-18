<template>
  <div class="mx-4 p-5 h-full bg-white rounded w-3/4">
    <h1 class="text-lg mb-4 font-semibold">Analisis Klasifikasi</h1>
    <div class="mb-2">
      <label for="region" class="block text-sm font-medium">Kabupaten/Kota</label>
      <select v-model="selectedRegion" id="region" class="select select-bordered w-1/2 max-w-xs">
        <option disabled value="">Pilih Kabupaten/Kota</option>
        <option value="">Semua Wilayah</option>
        <option v-for="region in regions" :key="region" :value="region">
          {{ region }}
        </option>
      </select>
    </div>
    <div class="mb-2 justify-items-start">
      <label for="region" class="block text-sm font-medium">Pilih Wilayah</label>
      <label class="label cursor-pointer">
        <input type="checkbox" checked="checked" class="checkbox mr-2" />
        <span class="label-text">Tahun</span>
      </label>
    </div>
    <div class="mb-2">
      <label for="analysisType" class="block text-sm font-medium">Jenis Analisis</label>
      <select v-model="selectedAnalysis" id="analysisType" class="select select-bordered w-1/2 max-w-xs">
        <option disabled >Pilih Jenis Analisis</option>
        <option value="ipm">Regresi</option>
        <option value="pendudukMiskin">Klasterisasi</option>
        <option value="stunting">Klasifikasi</option>
      </select>
    </div>
    <!-- <div class="mb-2">
      <label for="year" class="block text-sm font-medium">Pilih Tahun</label>
      <select v-model="selectedYear" id="year" class="select select-bordered w-1/2 max-w-xs">
        <option value="">Semua Tahun</option>
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div> -->
    <div class="mt-6">
      <button @click="analyzeData" class="btn btn-info text-white">
        Analisis
      </button>
    </div>
    <div v-if="chartData" class="mt-6">
      <canvas ref="scatterChart"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import dummyData from "../data/DummyData";

Chart.register(...registerables);

export default {
  data() {
    return {
      data: dummyData,
      selectedRegion: "",
      selectedAnalysis: "",
      selectedYear: "",
      chartData: null,
    };
  },
  computed: {
    regions() {
      return [...new Set(this.data.map((item) => item.region))];
    },
    years() {
      return [...new Set(this.data.map((item) => item.year))];
    },
  },
  methods: {
    analyzeData() {
      // Filter data berdasarkan pilihan
      const filteredData = this.data.filter((item) => {
        return (
          (!this.selectedRegion || item.region === this.selectedRegion) &&
          (!this.selectedYear || item.year === this.selectedYear)
        );
      });

      // Pilih variabel analisis berdasarkan jenis analisis
      let xData = filteredData.map((d) => d.apbd); // APBD selalu di X-axis
      let yData;
      let yLabel;
      if (this.selectedAnalysis === "ipm") {
        yData = filteredData.map((d) => d.ipm);
        yLabel = "IPM";
      } else if (this.selectedAnalysis === "pendudukMiskin") {
        yData = filteredData.map((d) => d.pendudukMiskin);
        yLabel = "Penduduk Miskin (%)";
      } else if (this.selectedAnalysis === "stunting") {
        yData = filteredData.map((d) => d.stunting);
        yLabel = "Stunting (%)";
      } else {
        alert("Pilih jenis analisis!");
        return;
      }

      // Set chartData untuk memastikan canvas dirender
      this.chartData = { xData, yData, yLabel };

      // Render Chart
      this.$nextTick(() => {
        this.renderChart(xData, yData, yLabel);
      });
    },

    renderChart(xData, yData, yLabel) {
      this.$nextTick(() => {
        const ctx = this.$refs.scatterChart?.getContext?.("2d");
        if (!ctx) {
          console.error("Canvas not ready for rendering chart");
          return;
        }

        if (this.chartInstance) {
          this.chartInstance.destroy();
        }

        this.chartInstance = new Chart(ctx, {
          type: "scatter",
          data: {
            datasets: [
              {
                label: `${yLabel} vs APBD`,
                data: xData.map((x, index) => ({ x, y: yData[index] })),
                backgroundColor: "#000000",
                borderColor: "#000000",
                borderWidth: 1,

              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "APBD (Miliaran)",
                },
              },
              y: {
                title: {
                  display: true,
                  text: yLabel,
                },
              },
            },
          },
        });
      });
    },
  },
};
</script>

<style>
/* Tambahkan styling tambahan jika diperlukan */
</style>
