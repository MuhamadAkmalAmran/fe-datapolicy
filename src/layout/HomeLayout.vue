<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content bg-base-200 flex flex-col w-full">
      <!-- Navbar with sticky -->
      <NavBar class="bg-base-300 rounded-none grid place-items-start sticky top-0 z-50" />
      <div class="card min-h-screen rounded-box grid place-items-start m-4 overflow-y-auto">
        <router-view />
      </div>
    </div>
    <SideBar />
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import NavBar from '@/components/NavBar.vue';

export default {
  components: {
    NavBar,
    SideBar,
  }
};
</script>
