<template>
  <div>
    <NavBar />
  </div>
  <div class="overflow-y-hidden flex p-3 sm:ml-64">
    <SideBar />
    <div class="border-gray-200 rounded-lg ml-6 w-full mt-14 min-h-screen">
      <router-view />
    </div>
  </div>
  <!-- <div class="drawer lg:drawer-open">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content bg-base-200 flex flex-col w-full">
      <NavBar class="bg-base-300 rounded-none grid place-items-start sticky top-0 z-50" />
      <div class="card min-h-screen rounded-box grid place-items-start m-4 overflow-y-auto">
        <router-view />
      </div>
    </div>
    <SideBar />
  </div> -->
</template>

<script>
import SideBar from '@/components/Sidebar/SideBar.vue';
import NavBar from '@/components/Navbar/NavBar.vue';

export default {
  components: {
    NavBar,
    SideBar,
  }
};
</script>
