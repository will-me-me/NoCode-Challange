// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: [{ src: "~/plugins/screen.js", mode: "client" }],
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["vuetify-nuxt-module"],
  ssr: true,
});
