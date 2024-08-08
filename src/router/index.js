import { createRouter, createWebHistory } from "vue-router";
import Message from "@/utils/Message.js";

const router = createRouter({
  // mode: "history",
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "默认路径",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/login",
      name: "登录",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/main",
      name: "main",
      meta: {
        requireAuth: true,
      },
      component: () => import("@/views/main.vue"),
      children: [
        {
          path: "",
          redirect: "home", //重定向 相当于设置默认路径
        },
        {
          path: "/home",
          name: "home",
          component: () => import("@/views/Home.vue"),
        },
        {
          path: "/videoMonitor",
          name: "videoMonitor",
          component: () => import("@/views/VideoMonitor/VideoMonitor.vue"),
        },
        {
          path: "/eventAnalysis",
          name: "eventAnalysis",
          component: () =>
            import("@/views/DataAnalysis/ChemicalParkAnalysis.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  //判断是否登录
  if (!localStorage.getItem("token")) {
    if (to.path !== "/login" && to.meta.requireAuth) {
      //未登录且要跳转的页面需要登录
      next("/login");
      Message.error("请先登录");
    }
    next();
  }
  next();
});

export default router;
