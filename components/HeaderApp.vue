<template>
  <section class="hero is-large bg Site-header">
    <div class="hero-body" />
  </section>
</template>

<script>
export default {}
</script>


<style>
body,
html {
  height: 100%;
  margin: 0;
}

.bg {
  /* The image used */
  background-image: url('../assets/borneo_20%.jpg');

  /* Full height */
  height: 100%;

  /* Center and scale the image nicely */
  background-position: right bottom;
  background-repeat: no-repeat;
  background-size: cover;
}

.Site-header {
  flex: none; /* 2 */
}
</style>
