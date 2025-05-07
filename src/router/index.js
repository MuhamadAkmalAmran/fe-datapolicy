import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/apiscraping",
    home: 'apiscraping',
    component: () => import("@/components/Pengumpulan Data/APIScraping.vue")
  },
  {
    path: "/visualization",
    component: () => import("@/components/VisualisasiData.vue")
  },
  {
    path: "/barchart",
    component: () => import("@/components/BarChart.vue")
  },
  {
    path: "/linechart",
    component: () => import("@/components/LineChart.vue")
  },
  {
    path: "/table",
    component: () => import("@/components/TableComponent.vue")
  },
  {
    path: "/analisisregresi",
    component: () => import("@/components/AnalysisRegresi.vue")
  },
  {
    path: "/scrappdf",
    component: () => import("@/components/ScrapPDF.vue")
  },
  {
    path: "/analisisklasifikasi",
    component: () => import("@/components/AnalysisKlasifikasi.vue")
  },
  {
    path: "/analisisklasterisasi",
    component: () => import("@/components/AnalysisKlasterisasi.vue")
  },
  {
    path: "/webscraping",
    component: () => import("@/components/Pengumpulan Data/WebScraping.vue")
  },
  {
    path: "/manual",
    component: () => import("@/components/Pengumpulan Data/AddData.vue")
  },
  {
    path: "/listdata",
    component: () => import("@/components/AllData.vue")
  },
  {
    path: "/adddata",
    component: () => import("@/components/Pengumpulan Data/AddData.vue")
  },
  {
    path: "/generate-file",
    component: () => import("@/components/GenerateFile.vue")
  },
  {
    path: "/indeks-gini",
    component: () => import("@/components/Form/IndeksGini.vue")
  },
  {
    path: "/scraping-list",
    component: () => import("@/components/ScrapingList.vue")
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
