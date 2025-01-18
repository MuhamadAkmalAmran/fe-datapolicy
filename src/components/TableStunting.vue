// DataTableComponent.vue
<template>
  <div class="overflow-x-auto">
    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">Tahun</th>
          <th class="border border-gray-300 px-4 py-2">Wilayah</th>
          <th class="border border-gray-300 px-4 py-2">Prevelensi Stunting (%)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td class="border border-gray-300 px-4 py-2">{{ item.year }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.city }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.prevalence }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['data'],
  methods: {
    getDataValue(row) {
      if (this.selectedDataType === "IPM") return row.ipm;
      if (this.selectedDataType === "Stunting") return row.stunting;
      if (this.selectedDataType === "Penduduk Miskin") return row.pendudukMiskin;
      return null;
    },
  },
};
</script>

<style scoped>
.table-auto {
  border: 1px solid #ccc;
  text-align: left;
}
</style>
