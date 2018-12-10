<template>
  <form @submit.prevent="onSave">
    <AppControlInput v-model="editedPost.author">作者名稱</AppControlInput>
    <AppControlInput v-model="editedPost.title">標題</AppControlInput>
    <AppControlInput v-model="editedPost.thumbnail">圖片網址</AppControlInput>
    <AppControlInput v-model="editedPost.content"
      control-type="textarea">內容</AppControlInput>
    <AppControlInput v-model="editedPost.previewText"
      control-type="textarea">預覽內容</AppControlInput>
    <AppButton type="submit">Save</AppButton>
    <AppButton type="button" style="margin-left: 10px"
      btn-style="cancel" @click="onCancel">Cancel</AppButton>
  </form>
</template>

<script>
export default {
  name: "AdminPostForm",
  props: {
    post: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      // 如果沒有接收到父層給的post就用默認空值
      editedPost: this.post
        ? { ...this.post }
        : {
            author: "",
            title: "",
            thumbnail: "",
            content: "",
            previewText: ""
          }
    };
  },
  methods: {
    onSave() {
      this.$emit("submit", this.editedPost);
    },
    onCancel() {
      this.$router.push("/admin");
    }
  }
};
</script>

<style scoped>
</style>