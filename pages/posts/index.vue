<template>
  <div class="posts-page">
    <PostList :posts="loadedPosts" />
  </div>
</template>

<script>
export default {
  name: "posts-page",
  head: {
    title: "Nuxt Posts",
    meta: [
      {
        hid: "description",
        name: "description",
        content: "Nuxt Posts 描述說明"
      }
    ]
  },
  computed: {
    loadedPosts() {
      return this.$store.getters.loadedPosts;
    }
  }
};
</script>

<style scoped>
.posts-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>