import Vue from "vue";
import App from "./App.vue";
import "vuetify/dist/vuetify.min.css";
import Vuetify from "vuetify";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(Toast, {
  timeout: 5000,
  position: "top-right",
});

new Vue({
  icons: {
    iconfont: "mdi",
  },
  vuetify: new Vuetify(),
  router,
  render: (h) => h(App),
}).$mount("#app");
