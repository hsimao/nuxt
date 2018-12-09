import Vuex from "vuex";
import axios from "axios";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
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
      }
    },
    actions: {
      // 伺服器端取得所有文章資料
      // nuxt初始化資料方法,
      // 第一次加載時在server端先取一次資料，並儲存到store
      // 接下來用戶端即可調用store資料，而不重複再跟server取資料
      nuxtServerInit(vuexContext, context) {
        return axios
          .get("https://myfiredase.firebaseio.com/posts.json")
          .then(res => {
            // 將原始firebase物件資料轉為陣列
            const postsArray = [];
            for (let key in res.data) {
              postsArray.push({ ...res.data[key], id: key });
            }
            vuexContext.commit("setPosts", postsArray);
          })
          .catch(err => console.log(err));
      },

      // 新增文章
      addPost({ commit }, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };
        return axios
          .post("https://myfiredase.firebaseio.com/posts.json", createdPost)
          .then(res => {
            // 資料庫新增成功，同步更新vuex資料
            commit("addPost", { ...createdPost, id: res.data.name });
          })
          .catch(err => console.log(err));
      },

      // 編輯文章
      editPost({ commit }, post) {
        return axios
          .put(`https://myfiredase.firebaseio.com/posts/${post.id}.json`, post)
          .then(() => {
            // 資料庫更新成功，同步更新vuex
            commit("editPost", post);
          })
          .catch(err => console.log(err));
      }
    },
    getters: {
      loadedPosts: state => state.loadedPosts
    }
  });
};

export default createStore;
