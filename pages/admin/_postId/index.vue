<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import AdminPostForm from "@/components/Admin/AdminPostForm";

export default {
  name: "post-edit",
  middleware: ["check-auth", "auth"],
  layout: "admin",
  components: {
    AdminPostForm
  },
  asyncData(context) {
    return context.app.$axios
      .$get(`/posts/${context.params.postId}.json`)
      .then(data => {
        return { loadedPost: { ...data, id: context.params.postId } };
      })
      .catch(err => console.log(err));
  },
  methods: {
    onSubmitted(editedPost) {
      this.$store.dispatch("editPost", editedPost).then(() => {
        this.$router.push("/admin");
      });
    }
  }
};
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>