import Vuex from "vuex";
import Cookie from "js-cookie";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
    },
    mutations: {
      setPosts(state, payload) {
        state.loadedPosts = payload;
      },
      addPost(state, payload) {
        state.loadedPosts.push(payload);
      },
      editPost(state, payload) {
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === payload.id
        );
        state.loadedPosts[postIndex] = payload;
      },
      setToken(state, paylod) {
        state.token = paylod;
      },
      clearToken(state) {
        state.token = null;
      }
    },
    actions: {
      // 伺服器端取得所有文章資料
      // nuxt初始化資料方法,
      // 第一次加載時在server端先取一次資料，並儲存到store
      // 接下來用戶端即可調用store資料，而不重複再跟server取資料
      nuxtServerInit(vuexContext, context) {
        return context.app.$axios
          .$get("/posts.json")
          .then(data => {
            // 將原始firebase物件資料轉為陣列
            const postsArray = [];
            for (let key in data) {
              postsArray.push({ ...data[key], id: key });
            }
            vuexContext.commit("setPosts", postsArray);
          })
          .catch(err => console.log(err));
      },

      // 新增文章
      addPost({ commit, state }, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };
        return this.$axios
          .$post(`/posts.json?auth=${state.token}`, createdPost)
          .then(data => {
            // 資料庫新增成功，同步更新vuex資料
            commit("addPost", { ...createdPost, id: data.name });
          })
          .catch(err => console.log(err));
      },

      // 編輯文章
      editPost({ commit, state }, post) {
        return this.$axios
          .$put(`/posts/${post.id}.json?auth=${state.token}`, post)
          .then(() => {
            // 資料庫更新成功，同步更新vuex
            commit("editPost", post);
          })
          .catch(err => console.log(err));
      },

      // 登入、註冊驗證
      authUser({ commit, dispatch }, authData) {
        let authUrl =
          "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" +
          process.env.firebaseAPIKey;
        if (!authData.isLogin) {
          authUrl =
            "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" +
            process.env.firebaseAPIKey;
        }
        return this.$axios
          .$post(authUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
          .then(res => {
            commit("setToken", res.idToken);
            const tokenExpiration =
              new Date().getTime() + Number.parseInt(res.expiresIn) * 1000;
            localStorage.setItem("token", res.idToken);
            localStorage.setItem("tokenExpiration", tokenExpiration);
            // 使用cookie儲存來讓伺服器端也能讀取，或統一都用cookie也可
            Cookie.set("jwt", res.idToken);
            Cookie.set("tokenExpiration", tokenExpiration);
            return this.$axios.$post("http://localhost:3000/api/track-data", {
              data: "hello"
            });
          })
          .catch(err => console.log(err));
      },

      // 判斷當前是在伺服器端還是用戶端，使用不同方式抓取token、token過期時間來驗證
      // *也可統一使用cookie驗證即可
      initAuth({ commit, dispatch }, req) {
        let expirationDate;
        let token;
        // server端會有會有request, 使用request內建方法調用cookie值來判斷
        if (req) {
          // 如果沒有cookie直接return
          if (!req.headers.cookie) {
            return;
          }
          // 抓取開頭為jwt=得值
          const jwtCookie = req.headers.cookie
            .split(";")
            .find(val => val.trim().startsWith("jwt="));
          // 沒有cookie也直接return
          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split("=")[1];
          expirationDate = req.headers.cookie
            .split(";")
            .find(val => val.trim().startsWith("tokenExpiration="))
            .split("=")[1];
        } else if (process.client) {
          // 用戶端使用localStorage
          token = localStorage.getItem("token");
          expirationDate = localStorage.getItem("tokenExpiration");
        }
        // 如果沒有token、或目前時間已經大於token保存時效，就清除token並return
        if (!token || new Date().getTime() > +expirationDate) {
          console.log("沒有token / token已失效");
          dispatch("logout");
          return;
        }
        commit("setToken", token);
      },

      // 登出
      logout({ commit }) {
        commit("clearToken");
        Cookie.remove("jwt");
        Cookie.remove("tokenExpiration");
        if (process.client) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
        }
      }
    },
    getters: {
      loadedPosts: state => state.loadedPosts,
      isAuth: state => state.token !== null
    }
  });
};

export default createStore;
