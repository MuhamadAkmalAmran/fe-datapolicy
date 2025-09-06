<template>
  <div>
    <NavBar />
    <SideBar />

    <div class="p-4 sm:ml-64">
      <div class="mt-14">
        <router-view />
      </div>
    </div>
  </div>
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
