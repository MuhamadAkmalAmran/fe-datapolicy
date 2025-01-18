import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/apiscraping",
    component: () => import("@/components/Scraping/APIScraping.vue")
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
    component: () => import("@/components/Scraping/WebScraping.vue")
  },
  {
    path: "/adddata",
    component: () => import("@/components/AddData.vue")
  },
  {
    path: "/listdata",
    component: () => import("@/components/AllData.vue")
  },
  {
    path: "/adddata",
    component: () => import("@/components/AddData.vue")
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
