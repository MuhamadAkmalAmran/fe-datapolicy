<template>
  <div class="mx-4 p-5 h-full bg-white rounded w-3/4">
    <h1 class="text-2xl mb-6 font-semibold">Analisis Regresi APBD</h1>

    <!-- Region Selection -->
    <div class="mb-4">
      <label for="region" class="block text-sm font-medium mb-2">Pilih Wilayah</label>
      <select
        v-model="selectedRegion"
        id="region"
        class="select select-bordered w-full max-w-xs"
      >
        <option disabled value="">Pilih Wilayah</option>
        <option v-for="region in availableRegions" :key="region" :value="region">
          {{ region }}
        </option>
      </select>
    </div>

    <!-- Variable Selection -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">Pilih Variabel untuk Analisis</label>
      <div class="space-y-2">
        <label class="flex items-center">
          <input type="checkbox" v-model="selectedVariables" value="ipm" class="checkbox mr-2">
          <span>IPM</span>
        </label>
        <label class="flex items-center">
          <input type="checkbox" v-model="selectedVariables" value="stunting" class="checkbox mr-2">
          <span>Stunting</span>
        </label>
        <label class="flex items-center">
          <input type="checkbox" v-model="selectedVariables" value="kemiskinan" class="checkbox mr-2">
          <span>Penduduk Miskin</span>
        </label>
      </div>
    </div>

    <!-- Analysis Button -->
    <div class="mt-6">
      <button
        @click="analyzeData"
        class="btn btn-primary"
        :disabled="!canAnalyze"
      >
        Analisis Regresi
      </button>
    </div>

    <!-- Results Section -->
    <div v-if="results" class="mt-8">
      <div v-for="(result, variable) in results" :key="variable" class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Hasil Analisis APBD - {{ getVariableLabel(variable) }}</h2>

        <!-- Correlation Results -->
        <div class="mb-4">
          <h3 class="text-lg font-medium mb-2">Korelasi</h3>
          <p>Koefisien Korelasi: {{ formatNumber(result.correlation.coefficient) }}</p>
          <p>P-Value: {{ formatNumber(result.correlation.p_value) }}</p>
        </div>

        <!-- Regression Results -->
        <div class="mb-4">
          <h3 class="text-lg font-medium mb-2">Regresi</h3>
          <p>R-Squared: {{ formatNumber(result.regression.r_squared) }}</p>
          <p>Adjusted R-Squared: {{ formatNumber(result.regression.adj_r_squared) }}</p>
          <p>F-Statistic: {{ formatNumber(result.regression.f_statistic) }}</p>
        </div>

        <!-- Scatter Plot -->
        <div class="mb-4">
          <canvas :ref="'chart_' + variable"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

export default {
  data() {
    return {
      selectedRegion: '',
      selectedVariables: [],
      results: null,
      chartInstances: {},
    };
  },

  computed: {
    availableRegions() {
      // Replace with actual regions from your data
      return ['Kota Yogyakarta', 'Kota Bandung', 'Kota Surabaya', 'Kulon Progo', 'Banyuwangi'];
    },

    canAnalyze() {
      return this.selectedRegion && this.selectedVariables.length > 0;
    }
  },

  methods: {
    async analyzeData() {
      try {
        const response = await axios.post('http://127.0.0.1:5000/analysis', {
          region: this.selectedRegion,
          analysis_type: 'multi',
          dependent_variables: this.selectedVariables
        });

        this.results = response.data.results;
        this.$nextTick(() => {
          this.renderCharts();
        });
      } catch (error) {
        console.error('Analysis error:', error);
        // Add error handling UI feedback here
      }
    },

    renderCharts() {
      // Destroy existing charts
      Object.values(this.chartInstances).forEach(chart => chart.destroy());
      this.chartInstances = {};

      // Create new charts
      Object.entries(this.results).forEach(([variable, result]) => {
        const ctx = this.$refs[`chart_${variable}`][0].getContext('2d');

        this.chartInstances[variable] = new Chart(ctx, {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: 'Actual Data',
                data: result.data_points.apbd_values.map((x, i) => ({
                  x: x,
                  y: result.data_points.dependent_values[i]
                })),
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
              },
              {
                label: 'Regression Line',
                data: result.data_points.apbd_values.map((x, i) => ({
                  x: x,
                  y: result.data_points.fitted_values[i]
                })),
                type: 'line',
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'APBD'
                }
              },
              y: {
                title: {
                  display: true,
                  text: this.getVariableLabel(variable)
                }
              }
            }
          }
        });
      });
    },

    getVariableLabel(variable) {
      const labels = {
        ipm: 'Indeks Pembangunan Manusia',
        stunting: 'Stunting',
        kemiskinan: 'Penduduk Miskin'
      };
      return labels[variable] || variable;
    },

    formatNumber(value) {
      return Number(value).toFixed(4);
    }
  }
};
</script>
