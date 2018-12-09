<template>
  <div>
    <TheHeader @sidenavToggle="displaySidenav = !displaySidenav" />
    <TheSideNav :show="displaySidenav" @close="displaySidenav = false" />
    <nuxt />
  </div>
</template>

<script>
import TheHeader from "@/components/Navigation/TheHeader";
import TheSideNav from "@/components/Navigation/TheSidenav";

export default {
  name: "defaultPage",
  components: {
    TheHeader,
    TheSideNav
  },
  data() {
    return {
      displaySidenav: false
    };
  }
};
</script>


<style>
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

html {
  font-family: "Open Sans", sans-serif, "微軟正黑體";
}

body {
  margin: 0;
}
</style>
