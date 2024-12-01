import Vue from "vue";
import Router from "vue-router";
import TabOne from "@/components/TabOne.vue";
import TabTwo from "@/components/TabTwo.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/one",
      component: TabOne,
    },
    {
      path: "/two",
      component: TabTwo,
    },
    {
      path: "*",
      redirect: "/one",
    },
  ],
});
