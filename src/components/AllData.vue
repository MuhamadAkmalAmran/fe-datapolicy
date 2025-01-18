<template>
  <div class="w-full m-2 rounded mt-4">
    <div class="rounded shadow p-4 bg-white">
      <!-- <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-semibold">Daftar Data {{ selectedDataType }}</h1>
        <span class="text-sm text-gray-500">
          {{ selectedRegion || 'Semua Wilayah' }}
        </span>
      </div>
      <div class="divider mt-0"></div> -->
      <!-- <TableComponent
        :tableData="processedTableData"
        :columns="tableColumns"
      /> -->
      <ListData :initialData="data" @update:data="handleDataUpdate" />



    </div>
  </div>
</template>

<script>
import dummyData from '@/data/DummyData';
import ListData from './ListData.vue';
import { ref } from 'vue';

export default {
  components: {
    ListData,
  },

  setup() {
    const data = ref([...dummyData])

    const handleDataUpdate = (newData) => {
      data.value = newData
    }
    return {
      data,
      handleDataUpdate,
    }
  }

}
</script>
