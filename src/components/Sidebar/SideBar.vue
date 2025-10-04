<template>
  <aside id="logo-sidebar"
    class="fixed top-0 left-0 z-40 w-72 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
    aria-label="Sidebar">
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <li v-for="(menu, index) in menuItems" :key="index">
          <button type="button"
            class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            :class="{ 'bg-gray-100 dark:bg-gray-700': isMenuActive(menu) }" :aria-controls="`dropdown-${index}`"
            :data-collapse-toggle="`dropdown-${index}`">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                :d="menu.icon" />
            </svg>
            <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{{ menu.title }}</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 4 4 4-4" />
            </svg>
          </button>
          <ul :id="`dropdown-${index}`" class="hidden py-2 space-y-2">
            <li v-for="(submenu, subIndex) in menu.submenus" :key="subIndex">

              <router-link :to="submenu.to"
                class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                :class="{ 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-semibold': $route.path === submenu.to }">
                {{ submenu.title }}
              </router-link>

            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { initFlowbite } from 'flowbite';

onMounted(() => {
  initFlowbite();
});

const route = useRoute();

const isMenuActive = (menu) => {
  return menu.submenus.some(submenu => route.path.startsWith(submenu.to));
};

const menuItems = ref([
  {
    title: 'Pengumpulan Data',
    icon: 'M8 8v1h4V8m4 7H4a1 1 0 0 1-1-1V5h14v9a1 1 0 0 1-1 1ZM2 1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z',
    submenus: [
      { title: 'API', to: '/app/apiscraping' },
      { title: 'Tambah Data', to: '/app/manual' },
      { title: 'Upload file', to: '/app/generate-file' },
      { title: 'APBD', to: '/app/apbd' },
    ],
  },
  {
    title: 'Visualisasi',
    icon: 'M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z',
    submenus: [
      { title: 'Chart', to: '/app/dashboard' },
      { title: 'Tabel', to: '/app/listdata' },
    ],
  },
  {
    title: 'Analisis',
    icon: 'M11 16.5A2.493 2.493 0 0 1 6.51 18H6.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .921-3.182 2.477 2.477 0 0 1 1.875-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 11 3.5m0 13v-13m0 13a2.492 2.492 0 0 0 4.49 1.5h.01a2.467 2.467 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.479 2.479 0 0 0-1.875-3.344A2.5 2.5 0 0 0 13.5 1 2.5 2.5 0 0 0 11 3.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M19 8.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185',
    submenus: [
      { title: 'Regresi', to: '/app/analisisregresi' },
    ],
  },
  {
    title: 'User Management',
    icon: 'M15 9h-1m-3 0h.01M12 3c-3.866 0-7 2.239-7 5s3.134 5 7 5 7-2.239 7-5-3.134-5-7-5Zm0 8c-2.67 0-5-1.343-5-3s2.33-3 5-3 5 1.343 5 3-2.33 3-5 3Zm-5.354-7.646a.5.5 0 1 0-.708.708l3.147 3.146a.5.5 0 0 0 .708 0l6.147-6.146a.5.5 0 0 0-.708-.708L12 8.793l-2.354-2.354Z',
    submenus: [
      { title: 'Users', to: '/app/users' },
    ],
  },
  {
    title: 'Master',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    submenus: [
      { title: 'Kategori', to: '/app/master/kategori' },
      { title: 'Provinsi', to: '/app/master/provinsi' },
      { title: 'Kabupaten/Kota', to: '/app/master/kabupaten-kota' },
    ],
  }
]);
</script>
