import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    redirect: "/welcome",
    component: () => import("../layout"),
    children: [
      {
        path: "/welcome",
        name: "welcome",
        component: () => import("../views/welcome"),
      },
      {
        path: "/users",
        name: "users",
        component: () => import("../views/users"),
      },
      {
        path: "/roles",
        name: "roles",
        component: () => import("../views/roles"),
      },

      {
        path: "/rights",
        name: "rights",
        component: () => import("../views/rights"),
      },
      {
        path: "/goods",
        name: "goods",
        component: () => import("../views/goods"),
      },
      {
        path: "/params",
        name: "params",
        component: () => import("../views/goods/params"),
      },
      {
        path: "/categories",
        name: "categories",
        component: () => import("../views/goods/categories"),
      },
      {
        path: "/orders",
        name: "orders",
        component: () => import("../views/orders"),
      },
      {
        path: "/reports",
        name: "reports",
        component: () => import("../views/reports"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../login"),
  },
  {
    path: "/404",
    name: "notundefined",
    component: () => import("../NotUndefined"),
  },
  {
    path: "*",
    redirect: "/404",
  },
];

const router = new VueRouter({
  routes,
});
const whiteList = ["/login", "/404"];
router.beforeEach(function (to, from, next) {
  Nprogress.start();
  if (store.getters.token) {
    if (to.path === "/login") {
      next("/");
    } else {
      next();
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next();
    } else {
      next("/login");
    }
  }
  Nprogress.done();
});
router.afterEach(function (to, from) {
  Nprogress.done();
});
export default router;
