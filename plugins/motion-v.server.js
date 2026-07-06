export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("motion", {
    getSSRProps() {
      return {};
    },
  });
});
