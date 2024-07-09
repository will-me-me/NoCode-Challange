export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("screenWidth", screen.width);
  nuxtApp.provide("screenHeight", screen.height);
});
