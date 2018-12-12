<template>
  <div class="single-post-page">
    <section class="post">
      <h1>{{loadedPost.title}}</h1>
      <div class="post-details">
        <div>最後一次更新{{loadedPost.updatedDate |
          formatDate}}</div>
        <div>作者：{{loadedPost.author}}</div>
      </div>
      <p>{{loadedPost.content}}</p>
    </section>
    <section class="post-feedback">
      <p>Let me know now <a href="mailto:e087754958@gmail.com">e087754958@gmail.com</a>.</p>
    </section>
  </div>
</template>

<script>
export default {
  name: "post-page-detail",
  asyncData(context) {
    // 判斷是否已經有靜態編譯傳遞過來的檔案，若有就取用並回傳，不執行以下http請求
    if (context.payload) {
      return {
        loadedPost: context.payload.postData
      };
    }
    return context.app.$axios
      .$get(`/posts/${context.params.id}.json`)
      .then(data => {
        return { loadedPost: data };
      })
      .catch(err => console.log(err));
  }
};
</script>

<style scoped>
.single-post-page {
  padding: 30px;
  text-align: center;
  box-sizing: border-box;
}

.post {
  width: 100%;
}

@media (min-width: 768px) {
  .post {
    width: 600px;
    margin: auto;
  }
}

.post-title {
  margin: 0;
}

.post-details {
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 3px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

@media (min-width: 768px) {
  .post-details {
    flex-direction: row;
  }
}

.post-detail {
  color: rgb(88, 88, 88);
  margin: 0 10px;
}

.post-feedback a {
  color: red;
  text-decoration: none;
}

.post-feedback a:hover,
.post-feedback a:active {
  color: salmon;
}
</style>