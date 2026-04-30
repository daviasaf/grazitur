// nuxt.config.ts
export default defineNuxtConfig({
  css: ["bootstrap/dist/css/bootstrap.min.css", "~/assets/css/main.css"],

  compatibilityDate: "2024-04-03",
  app: {
    head: {
      title: "GraziTur",
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
  devtools: { enabled: true },

  runtimeConfig: {
    adminPassword: process.env.ADMIN_PASSWORD || "123456",
  },
});
