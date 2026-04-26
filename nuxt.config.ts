// nuxt.config.ts
export default defineNuxtConfig({
  css: ["bootstrap/dist/css/bootstrap.min.css"],
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    adminPassword: import.meta.env.ADMIN_PASSWORD || "123456",
  },
});
