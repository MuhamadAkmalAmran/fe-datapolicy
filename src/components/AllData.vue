<template>
  <div class="w-full rounded">
    <ListData :initialData="data" @update:data="handleDataUpdate" />
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
