<template>
  <div id="app" class="bg-gray-100">



    <NavBar />
    <SideBar />

    <div class="p-2 sm:ml-64">
      <div class="p-3 border-gray-200 rounded-lg mt-10 min-h-screen">
        <router-view></router-view>
      </div>
    </div>
  </div>

  <!-- <div class="drawer lg:drawer-open">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content bg-base-200 flex flex-col w-full">
      <NavBar class="bg-base-300 rounded-none grid place-items-start sticky top-0 z-50" />
      <div class="card rounded-box grid m-4 overflow-y-auto">
        <router-view />
      </div>
    </div>
    <SideBar />
  </div> -->
</template>

<script>
import NavBar from './components/NavBar.vue';
import SideBar from './components/SideBar.vue';


export default {
  name: 'App',
  components: {
    SideBar,
    NavBar,
  }
};
</script>
