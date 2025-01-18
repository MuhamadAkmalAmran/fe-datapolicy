<template>
  <div class="w-full m-2 p-6 bg-white rounded">
    <h1 class="text-2xl font-semibold mb-4">Visualisasi Data</h1>
    <!-- Form -->
    <form>
      <div class="grid gap-6 grid-cols-2 md:grid-rows-1">
        <!-- Jenis Data -->
        <div>
          <label class="block text-sm">Jenis Data</label>
          <select v-model="selectedDataType" class="select text-sm select-bordered w-full">
            <option disabled>Pilih Data</option>
            <option v-for="type in dataTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <!-- Wilayah -->
        <div>
          <label class="block text-sm">Wilayah</label>
          <select v-model="selectedRegion" class="select text-sm select-bordered w-full">
            <option value="">Semua Wilayah</option>
            <option v-for="region in regions" :key="region" :value="region">
              {{ region }}
            </option>
          </select>
        </div>
      </div>
    </form>
  </div>

  <!-- Charts Section -->
  <div class="w-full m-2 rounded place-content-center">
    <div class="grid gap-3 grid-cols-2">
      <div class="rounded shadow p-4 bg-white">
        <h1 class="text-2xl font-semibold">{{ chartTitle }}</h1>
        <div class="divider mt-0"></div>
        <BarChartComponent :chartData="chartData" :chartOptions="chartOptions" />
      </div>
      <div class="rounded shadow p-4 bg-white">
        <h1 class="text-2xl font-semibold">{{ chartTitle }}</h1>
        <div class="divider mt-0"></div>
        <LineChartComponent :chartData="chartData" :chartOptions="chartOptions" />
      </div>
    </div>
  </div>

  <!-- Table Section -->
  <!-- <div class="w-full m-2 rounded mt-4">
    <div class="rounded shadow p-4 bg-white">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-semibold">Data {{ selectedDataType }}</h1>
        <span class="text-sm text-gray-500">
          {{ selectedRegion || 'Semua Wilayah' }}
        </span>
      </div>
      <div class="divider mt-0"></div>
      <TableComponent
        :tableData="processedTableData"
        :columns="tableColumns"
      />
      <ListData :initialData="data" @update:data="handleDataUpdate" />



    </div>
  </div> -->
</template>

<script>
import { ref, computed, watch } from 'vue'
import BarChartComponent from "@/components/BarChart.vue"
import LineChartComponent from "@/components/LineChart.vue"
// import TableComponent from '@/components/TableComponent.vue'
import dummyData from "../data/DummyData"
// import ListData from './ListData.vue'


export default {
  components: {
    BarChartComponent,
    LineChartComponent,
    // TableComponent,
    // ListData,
  },

  setup() {
    // Reactive state
    const selectedDataType = ref('IPM')
    const selectedRegion = ref('')
    const regions = ref([
      "Kota Yogyakarta",
      "Kulon Progo",
      "Kota Bandung",
      "Kota Surabaya",
      "Banyuwangi"
    ])
    const dataTypes = ref(["IPM", "Stunting", "Jumlah Penduduk Miskin", "APBD"])
    const rawData = ref(dummyData)

    // const data = ref([...dummyData])

    // const handleDataUpdate = (newData) => {
    //   data.value = newData
    // }

    // Computed properties for table
    const tableColumns = computed(() => [
      { key: 'region', label: 'Wilayah' },
      { key: 'year', label: 'Tahun' },
      { key: 'value', label: selectedDataType.value },
    ])

    const filteredData = computed(() => {
      return rawData.value.filter((row) => {
        return !selectedRegion.value || row.region === selectedRegion.value
      })
    })

    const processedTableData = computed(() => {
      return filteredData.value.map(row => ({
        region: row.region,
        year: row.year,
        value: getDataValue(row, selectedDataType.value)
      }))
    })

    const chartData = computed(() => {
      const labels = [...new Set(filteredData.value.map((row) => row.year))].sort()
      const regionsToDisplay = selectedRegion.value === ''
        ? regions.value
        : [selectedRegion.value]

      const datasets = regionsToDisplay.map((region) => {
        const regionData = filteredData.value.filter((row) => row.region === region)
        // Sort data by year to ensure correct line chart
        regionData.sort((a, b) => a.year - b.year)

        return {
          label: region,
          data: regionData.map((row) => getDataValue(row, selectedDataType.value)),
          backgroundColor: getRegionColor(region),
          borderColor: getRegionColor(region, true),
          borderWidth: 1,
        }
      })

      return { labels, datasets }
    })

    const chartTitle = computed(() => {
      const regionText = selectedRegion.value || "Semua Wilayah"
      const dataTypeText = selectedDataType.value || "Data"
      return `${dataTypeText} ${regionText}`
    })

    const chartOptions = computed(() => ({
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    }))

    // Methods
    const getDataValue = (row, type) => {
      switch (type) {
        case "IPM": return row.ipm
        case "Stunting": return row.stunting
        case "Jumlah Penduduk Miskin": return row.pendudukMiskin
        case "APBD": return row.apbd
        default: return null
      }
    }

    const getRegionColor = (region, isBorder = false) => {
      const colors = {
        "Kota Yogyakarta": "rgba(54, 162, 235, 0.6)",
        "Kulon Progo": "rgba(255, 99, 132, 0.6)",
        "Kota Bandung": "rgba(75, 192, 192, 0.6)",
        "Kota Surabaya": "rgba(255, 0, 0, 0.6)",
        "Banyuwangi": "rgba(0, 0, 255, 0.6)",
      }

      const color = colors[region] || "rgba(201, 203, 207, 0.6)"
      return isBorder ? color.replace("0.6", "1") : color
    }

    // Watch for changes
    watch([selectedDataType, selectedRegion], ([newDataType, newRegion]) => {
      console.log('Data type changed:', newDataType)
      console.log('Region changed:', newRegion)
    })

    return {
      // State
      selectedDataType,
      selectedRegion,
      regions,
      dataTypes,
      // Computed
      filteredData,
      chartData,
      chartOptions,
      chartTitle,
      tableColumns,
      processedTableData,
      // data,
      // handleDataUpdate
    }
  }
}
</script>
