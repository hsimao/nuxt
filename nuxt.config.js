const pkg = require("./package");
const bodyParser = require("body-parser");
const axios = require("axios");

module.exports = {
  // mode: "universal",
  // mode: "spa",
  // npm run generate
  mode: "universal",

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Open+Sans"
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   ** 頁面頂部loading效果
   ** 關閉 loading: false
   */
  loading: {
    color: "blue",
    failedColor: "red",
    height: "2px",
    duration: 3000,
    continuous: true
  },
  // 自定義loading組件
  // loading: "~/components/Loading",

  /*
   ** Global CSS
   */
  css: ["~assets/styles/global.sass"],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~plugins/ui-components.js", "~plugins/format-date.js"],

  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios"],

  /*
   ** 設置axios的預設url
   */
  axios: {
    baseURL: process.env.BASE_URL || "https://myfiredase.firebaseio.com/"
    // credentials: false
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  // 環境變量設定
  env: {
    baseUrl: process.env.BASE_URL || "https://myfiredase.firebaseio.com/",
    firebaseAPIKey: "AIzaSyBdVxF4inqnXtqiqFLawj0dewOAPsl65j4"
  },
  // 設置router
  router: {
    // base 設置根網址, 預設"/"
    // base: "/my-app/"
    // ====
    // extendRoutes 自訂router
    // 若輸入沒有在pages定義的router將會套用到以下指定頁面
    // extendRoutes(routes, resolve) {
    //   routes.push({
    //     path: "*",
    //     component: resolve(__dirname, "pages/index.vue")
    //   });
    // }
    // ====
    // 自訂active link class名稱, 預設為 nuxt-link-active
    // linkActiveClass: "active"
  },
  /*
   ** transition 設置頁面轉場動畫
   ** name: "fade" class設置對應前綴 => .fade-enter-active
   */
  transition: {
    name: "fade",
    mode: "out-in"
  },

  serverMiddleware: [bodyParser.json(), "~/api"],

  // 產出靜態頁面
  generate: {
    routes: function() {
      // 從資料出抓出所有文章資訊，逐一產出各別頁面資料夾與檔案
      return axios
        .get("https://myfiredase.firebaseio.com/posts.json")
        .then(res => {
          const routes = [];
          for (const key in res.data) {
            routes.push({
              route: "/posts/" + key,
              // 將文章資料儲存起來，交由前端判斷如果是靜態頁面就調用，不重新請求
              payload: { postData: res.data[key] }
            });
          }
          return routes;
        });
    }
  }
};
