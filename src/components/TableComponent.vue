<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(row, index) in tableData" :key="index">
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500"
          >
            {{ formatValue(row[column.key]) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableComponent',

  props: {
    tableData: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },

  setup() {
    const formatValue = (value) => {
      if (typeof value === 'number') {
        return value.toLocaleString('id-ID', {
          maximumFractionDigits: 2
        })
      }
      return value
    }

    return {
      formatValue
    }
  }
})
</script>
