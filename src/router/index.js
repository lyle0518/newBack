import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    component: () => import("@/views/Login")
  },
  {
    path: "/",
    // 重定向设置
    component: () => import("@/views/Index"),
    redirect: "/post-list",
    children: [
      {
        path: "post-list",
        component: () => import("@/views/post-list")
      },
      {
        path: "new-post",
        component: () => import("@/views/new-post")
      },
      {
        path: "edit-post/:id",
        component: () => import("@/views/EditPost")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
  if (to.path !== "/login") {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    if (userInfo.token && userInfo.user.role.type === "admin") {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});
export default router;
