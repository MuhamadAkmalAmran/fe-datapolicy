<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-4">
        <h1 class="text-3xl font-bold text-gray-900">Analisis Regresi Data</h1>
        <p class="mt-2 text-gray-600">Analisis hubungan antar variabel menggunakan metode regresi statistik</p>
      </div>

      <!-- Loading Overlay -->
      <div v-if="isLoading" class="fixed inset-0 z-50 bg-gray-500/50 backdrop-blur-sm flex items-center justify-center">
        <div class="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
          <svg class="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <p class="text-gray-700 font-medium">Sedang memproses data...</p>
          <div class="w-48 bg-gray-200 rounded-full h-2 mt-4">
            <div class="bg-blue-600 h-2 rounded-full w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 w-full">
        <!-- Input Panel -->
        <div class="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
          <div class="mb-6">
            <div class="flex items-center space-x-2 mb-6">
              <svg class="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <h2 class="text-xl font-semibold text-gray-900">Parameter Analisis</h2>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Jenis Regresi
              </label>
              <div class="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <button @click="regressionType = 'linear'" :class="[
                  'py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2',
                  regressionType === 'linear'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]">
                  <span>Linear</span>
                </button>
                <button @click="regressionType = 'non_linear'" :class="[
                  'py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2',
                  regressionType === 'non_linear'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]">
                  <span>Non-Linear</span>
                </button>
              </div>
            </div>

            <!-- Region Selection -->
            <div class="mb-6">
              <label for="region" class="block text-sm font-medium text-gray-700 mb-2">
                Wilayah
              </label>
              <select v-model="selectedRegion" id="region"
                class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option disabled value="">Pilih Wilayah</option>
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>

            <!-- Analysis Type Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Jenis Analisis
              </label>
              <div class="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <button @click="analysisType = 'single'" :class="[
                  'py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2',
                  analysisType === 'single'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 13v-1m4 1v-3m4 3V8M12 20h7a2 2 0 002-2V6a2 2 0 00-2-2h-1"></path>
                  </svg>
                  <span>Single Variabel</span>
                </button>
                <button @click="analysisType = 'multi'" :class="[
                  'py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2',
                  analysisType === 'multi'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                    </path>
                  </svg>
                  <span>Multi Variabel</span>
                </button>
              </div>
            </div>

            <!-- Single Variable Selection -->
            <template v-if="analysisType === 'single'">
              <div class="space-y-4 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Variabel Independen (X)
                  </label>
                  <select v-model="selectedIndependentVar"
                    class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <option disabled value="">Pilih Variabel</option>
                    <option v-for="category in categories" :key="category.id" :value="category.name">
                      {{ category.display_name || category.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Variabel Dependen (Y)
                  </label>
                  <select v-model="selectedDependentVar"
                    class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <option disabled value="">Pilih Variabel</option>
                    <option v-for="category in availableDependentVars" :key="category.id" :value="category.name">
                      {{ category.display_name || category.name }}
                    </option>
                  </select>
                </div>
              </div>
            </template>

            <!-- Multi Variable Selection -->
            <template v-else>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Variabel (min. 2)
                </label>
                <div class="space-y-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 p-2">
                  <label v-for="category in categories" :key="category.id"
                    class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                    <input type="checkbox" :value="category.name" v-model="selectedMultiVars"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">{{ category.display_name || category.name }}</span>
                  </label>
                </div>
              </div>
            </template>

            <!-- Analysis Button -->
            <button @click="performRegression" :disabled="!canAnalyze"
              class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              Mulai Analisis
            </button>

            <!-- Validation Message -->
            <div v-if="!canAnalyze" class="mt-2 flex items-center space-x-2 text-amber-600 text-sm">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Lengkapi semua parameter untuk memulai analisis</span>
            </div>
          </div>
        </div>

        <!-- Modal for Results -->
        <div v-if="analysisResults"
          class="fixed inset-0 z-50 bg-gray-500/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div class="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">Hasil Analisis</h2>
              <button @click="analysisResults = null" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Results Content -->
            <div class="space-y-2">
              <!-- Statistical Metrics -->
              <div class="grid grid-cols-2 gap-2">
                <div v-if="analysisType === 'single'" class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600">Korelasi</p>
                  <p class="text-xl font-bold">{{ formatNumber(analysisResults.details.correlation) }}</p>
                  <p class="text-sm text-gray-500">Hubungan antar variabel</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600">R-Squared</p>
                  <p class="text-xl font-bold">{{ formatPercent(analysisResults.details.r_squared) }}</p>
                  <p class="text-sm text-gray-500">Kualitas model</p>
                </div>
              </div>

              <!-- Charts -->
              <div class="space-y-2">
                <div v-if="analysisType === 'single'" class="h-64 bg-white rounded-lg border p-4">
                  <canvas id="varVarChart"></canvas>
                </div>

                <!-- Time Series Chart -->
                <div class="h-64 bg-white rounded-lg border p-4">
                  <canvas id="timeSeriesChart"></canvas>
                </div>

                <!-- Scatter Plot Matrix (for multi-variable analysis) -->
                <div v-if="analysisType === 'multi' && regressionType === 'non_linear'"
                  class="h-64 bg-white rounded-lg border p-4">
                  <canvas id="scatterPlotChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from 'vue'
import axios from 'axios'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'RegressionAnalysis',
  setup() {
    const selectedRegion = ref('')
    const analysisType = ref('single')
    const selectedIndependentVar = ref('')
    const selectedDependentVar = ref('')
    const selectedMultiVars = ref([])
    const analysisResults = ref(null)
    const isLoading = ref(false)
    const chartInstances = ref({})
    const regressionType = ref('linear')

    const cities = ref([
      "Kota Yogyakarta",
      "Kulon Progo",
      "Kota Bandung",
      "Kota Surabaya",
      "Banyuwangi"
    ])

    const categories = ref([])

    // Computed
    const availableDependentVars = computed(() => {
      return categories.value.filter(cat => cat.name !== selectedIndependentVar.value)
    })

    const canAnalyze = computed(() => {
      if (!selectedRegion.value || !regressionType.value) return false
      if (analysisType.value === 'single') {
        return selectedIndependentVar.value && selectedDependentVar.value
      }
      return selectedMultiVars.value.length >= 2
    })

    // Methods
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories')
        categories.value = response.data
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const performRegression = async () => {
      isLoading.value = true;
      destroyCharts();
      analysisResults.value = null;

      try {
        const payload = {
          city: selectedRegion.value,
          regression_type: regressionType.value,
          analysis_type: analysisType.value,
        };

        if (analysisType.value === "single") {
          payload.independent_variable = selectedIndependentVar.value;
          payload.dependent_variable = selectedDependentVar.value;
        } else {
          payload.variables = selectedMultiVars.value;
        }

        const response = await axios.post("http://localhost:5000/analysis", payload);
        console.log("API Response:", response.data); // Debugging
        analysisResults.value = response.data;

        await nextTick();
        renderCharts();
      } catch (error) {
        console.error("Regression analysis error:", error);
        alert("Terjadi kesalahan saat melakukan analisis. Silakan coba lagi.");
      } finally {
        isLoading.value = false;
      }
    };

    const formatNumber = (value) => {
      return Number(value).toLocaleString('id-ID', { maximumFractionDigits: 2 })
    }

    const formatPercent = (value) => {
      return (value * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + '%'
    }

    const destroyCharts = () => {
      Object.values(chartInstances.value).forEach(chart => chart.destroy())
      chartInstances.value = {}
    }

    const renderCharts = () => {
      if (!analysisResults.value || !analysisResults.value.details || !analysisResults.value.details.data) {
        console.error("Invalid analysis results data");
        return;
      }

      if (analysisType.value === "single") {
        renderSingleVariableCharts();
      } else {
        renderMultiVariableChart();
      }
    };

    const renderSingleVariableCharts = () => {
      const data = analysisResults.value.details.data;

      // Validasi data
      if (
        !data ||
        !data.independent_values ||
        !data.dependent_values ||
        !Array.isArray(data.independent_values) ||
        !Array.isArray(data.dependent_values)
      ) {
        console.error("Data tidak valid atau tidak lengkap");
        return;
      }

      // Render chart
      const varVarCtx = document.getElementById("varVarChart");
      chartInstances.value.varVar = new Chart(varVarCtx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Data Aktual",
              data: data.independent_values.map((x, i) => ({
                x: x,
                y: data.dependent_values[i],
              })),
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              pointRadius: 6,
              pointHoverRadius: 8,
            },
            {
              label: "Garis Regresi",
              data: data.independent_values.map((x, i) => ({
                x: x,
                y: data.fitted_values[i],
              })),
              type: "line",
              borderColor:
                regressionType.value === "linear"
                  ? "rgba(239, 68, 68, 0.8)"
                  : "rgba(16, 185, 129, 0.8)",
              backgroundColor: "transparent",
              pointRadius: 0,
              borderWidth: 2,
              tension: regressionType.value === "non_linear" ? 0.4 : 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "nearest",
            intersect: false,
          },
          plugins: {
            tooltip: {
              backgroundColor: "rgba(17, 24, 39, 0.8)",
              padding: 12,
              titleFont: {
                size: 14,
                weight: "bold",
              },
              bodyFont: {
                size: 13,
              },
              cornerRadius: 4,
            },
            legend: {
              position: "top",
              labels: {
                padding: 16,
                font: {
                  size: 13,
                },
                usePointStyle: true,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: getCategoryDisplayName(selectedIndependentVar.value),
                padding: {
                  top: 10,
                },
                font: {
                  size: 13,
                  weight: "500",
                },
              },
              grid: {
                color: "rgba(243, 244, 246, 1)",
              },
            },
            y: {
              title: {
                display: true,
                text: getCategoryDisplayName(selectedDependentVar.value),
                padding: {
                  bottom: 10,
                },
                font: {
                  size: 13,
                  weight: "500",
                },
              },
              grid: {
                color: "rgba(243, 244, 246, 1)",
              },
            },
          },
        },
      });

      // Time Series Chart
      const timeSeriesCtx = document.getElementById("timeSeriesChart");
      chartInstances.value.timeSeries = new Chart(timeSeriesCtx, {
        type: "line",
        data: {
          labels: data.years,
          datasets: [
            {
              label: getCategoryDisplayName(selectedIndependentVar.value),
              data: data.independent_values,
              borderColor: "rgba(59, 130, 246, 0.8)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              yAxisID: "y1",
              tension: regressionType.value === "non_linear" ? 0.4 : 0.3,
              borderWidth: 2,
            },
            {
              label: getCategoryDisplayName(selectedDependentVar.value),
              data: data.dependent_values,
              borderColor: "rgba(239, 68, 68, 0.8)",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              yAxisID: "y2",
              tension: regressionType.value === "non_linear" ? 0.4 : 0.3,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            tooltip: {
              backgroundColor: "rgba(17, 24, 39, 0.8)",
              padding: 12,
              titleFont: {
                size: 14,
                weight: "bold",
              },
              bodyFont: {
                size: 13,
              },
              cornerRadius: 4,
            },
            legend: {
              position: "top",
              labels: {
                padding: 16,
                font: {
                  size: 13,
                },
                usePointStyle: true,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Tahun",
                padding: {
                  top: 10,
                },
                font: {
                  size: 13,
                  weight: "500",
                },
              },
              grid: {
                color: "rgba(243, 244, 246, 1)",
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "left",
              title: {
                display: true,
                text: getCategoryDisplayName(selectedIndependentVar.value),
                font: {
                  size: 13,
                  weight: "500",
                },
              },
              grid: {
                color: "rgba(243, 244, 246, 1)",
              },
            },
            y2: {
              type: "linear",
              display: true,
              position: "right",
              title: {
                display: true,
                text: getCategoryDisplayName(selectedDependentVar.value),
                font: {
                  size: 13,
                  weight: "500",
                },
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        },
      });
    };

    const renderMultiVariableChart = () => {
      const data = analysisResults.value.details.data;

      // Validasi data.values
      if (!data.values || typeof data.values !== "object" || Object.keys(data.values).length === 0) {
        console.error("Invalid or missing 'values' in analysis results data");
        return;
      }

      // Time Series Chart
      const timeSeriesCtx = document.getElementById("timeSeriesChart");
      const datasets = Object.entries(data.values).map(([varName, values], index) => ({
        label: getCategoryDisplayName(varName),
        data: values,
        borderColor: `rgba(${59 + index * 50}, ${130 + index * 50}, ${246 - index * 50}, 0.8)`,
        backgroundColor: `rgba(${59 + index * 50}, ${130 + index * 50}, ${246 - index * 50}, 0.1)`,
        yAxisID: `y${index}`,
        tension: regressionType.value === "non_linear" ? 0.4 : 0.3,
        borderWidth: 2,
      }));

      chartInstances.value.multiTimeSeries = new Chart(timeSeriesCtx, {
        type: "line",
        data: {
          labels: data.years,
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            tooltip: {
              backgroundColor: "rgba(17, 24, 39, 0.8)",
              padding: 12,
              titleFont: {
                size: 14,
                weight: "bold",
              },
              bodyFont: {
                size: 13,
              },
              cornerRadius: 4,
            },
            legend: {
              position: "top",
              labels: {
                padding: 16,
                font: {
                  size: 13,
                },
                usePointStyle: true,
              },
            },
          },
          scales: createMultiVariableScales(datasets),
        },
      });

      // Scatter Plot Matrix (for non-linear regression)
      if (regressionType.value === "non_linear") {
        const scatterCtx = document.getElementById("scatterPlotChart");
        const scatterDatasets = createScatterPlotDatasets(data, [
          "rgba(59, 130, 246, 0.8)",  // blue
          "rgba(239, 68, 68, 0.8)",   // red
          "rgba(16, 185, 129, 0.8)",  // green
          "rgba(245, 158, 11, 0.8)",  // yellow
        ]);

        chartInstances.value.scatterMatrix = new Chart(scatterCtx, {
          type: "scatter",
          data: {
            datasets: scatterDatasets,
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Matrix Scatter Plot Hubungan Antar Variabel",
                font: {
                  size: 16,
                  weight: "bold",
                },
                padding: 20,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const dataset = context.dataset;
                    const point = context.raw;
                    return `${dataset.label}: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
                  },
                },
              },
            },
            scales: {
              x: {
                type: "linear",
                position: "bottom",
                grid: {
                  color: "rgba(243, 244, 246, 1)",
                },
              },
              y: {
                type: "linear",
                grid: {
                  color: "rgba(243, 244, 246, 1)",
                },
              },
            },
          },
        });
      }
    };

    const createMultiVariableScales = (datasets) => {
      const scales = {
        x: {
          title: {
            display: true,
            text: "Tahun",
            padding: { top: 10 },
            font: { size: 13, weight: "500" },
          },
          grid: {
            color: "rgba(243, 244, 246, 1)",
          },
        },
      };

      datasets.forEach((dataset, index) => {
        scales[`y${index}`] = {
          type: "linear",
          display: true,
          position: index % 2 === 0 ? "left" : "right",
          title: {
            display: true,
            text: dataset.label,
            font: { size: 13, weight: "500" },
          },
          grid: {
            drawOnChartArea: index === 0,
          },
        };
      });

      return scales;
    };

    const createScatterPlotDatasets = (data, colors) => {
      const variables = Object.keys(data.values);
      const datasets = [];

      for (let i = 0; i < variables.length; i++) {
        for (let j = i + 1; j < variables.length; j++) {
          const xVar = variables[i];
          const yVar = variables[j];

          datasets.push({
            label: `${getCategoryDisplayName(xVar)} vs ${getCategoryDisplayName(yVar)}`,
            data: data.values[xVar].map((x, index) => ({
              x: x,
              y: data.values[yVar][index],
            })),
            backgroundColor: colors[datasets.length % colors.length],
            pointRadius: 6,
            pointHoverRadius: 8,
          });
        }
      }

      return datasets;
    };

    const getCategoryDisplayName = (categoryName) => {
      const category = categories.value.find(cat => cat.name === categoryName);
      return category ? (category.display_name || category.name) : categoryName;
    };

    // Lifecycle Hooks
    onMounted(() => {
      fetchCategories();
    });

    onUnmounted(() => {
      destroyCharts();
    });

    // Watchers
    watch([analysisType, regressionType], () => {
      selectedIndependentVar.value = '';
      selectedDependentVar.value = '';
      selectedMultiVars.value = [];
      analysisResults.value = null;
      destroyCharts();
    });

    return {
      // State
      selectedRegion,
      regressionType,
      cities,
      categories,
      analysisType,
      selectedIndependentVar,
      selectedDependentVar,
      selectedMultiVars,
      analysisResults,
      isLoading,

      // Computed
      canAnalyze,
      availableDependentVars,

      // Methods
      performRegression,
      formatNumber,
      formatPercent,
      getCategoryDisplayName,
    };
  },
};
</script>
