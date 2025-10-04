import { createRouter, createWebHistory } from "vue-router";

// Import layout components
import HomeLayout from "@/layout/HomeLayout.vue";
import AuthLayout from "@/layout/AuthLayout.vue";

const routes = [
  // Rute untuk autentikasi (tanpa sidebar/navbar)
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/LoginView.vue"),
      },
      // Anda bisa menambahkan halaman register di sini nanti
      // {
      //   path: "register",
      //   name: "Register",
      //   component: () => import("@/views/RegisterView.vue"),
      // },
    ],
  },

  // Rute untuk aplikasi utama (dengan sidebar/navbar)
  {
    path: "/app", // Kita gunakan prefix '/app' untuk halaman internal
    component: HomeLayout,
    redirect: '/app/dashboard', // Halaman default setelah login
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/components/VisualisasiData.vue"),
      },
      {
        path: "apiscraping",
        name: "APIScraping",
        component: () => import("@/components/Pengumpulan Data/APIScraping.vue"),
      },
      {
        path: "apbd",
        name: "ScrapeAPBD",
        component: () => import("@/components/Pengumpulan Data/ScrapeAPBD.vue"),
      },
      {
        path: "manual",
        name: "AddData",
        component: () => import("@/components/Pengumpulan Data/AddData.vue"),
      },
      {
        path: "generate-file",
        name: "GenerateFile",
        component: () => import("@/components/GenerateFile.vue"),
      },
      {
        path: "listdata",
        name: "ListData",
        component: () => import("@/components/AllData.vue"),
      },
      {
        path: "analisisregresi",
        name: "AnalisisRegresi",
        component: () => import("@/components/AnalysisRegresi.vue"),
      },
      {
        path: "users",
        name: "UserManagement",
        component: () => import("@/components/UserManagement.vue"),
      },
      {
        path: "master/kategori",
        name: "Categories",
        component: () => import("@/components/CategoriesPage.vue"),
      },
    ],
  },

  // Rute root '/' akan selalu redirect ke halaman login.
  // Ini menjadi satu-satunya entry point saat web dibuka.
  {
    path: '/',
    redirect: '/app/dashboard',
  },

  // (Opsional) Rute catch-all untuk halaman yang tidak ditemukan
  // Akan mengarahkan kembali ke login jika URL salah
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/auth/login'
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
