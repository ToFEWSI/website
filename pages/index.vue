<template>
  <div>
    <section class="hero is-large bg">
      <div class="hero-body" />
      <div class="container has-text-centered ">
        <h1 class="title has-text-white has-text-weight-bold is-size-1">
          Project
          To<span class="has-text-warning">F</span>E<span class="has-text-warning">W</span>SI
        </h1>
        <h2 class="subtitle has-text-white has-text-weight-bold is-size-4">
          Towards a <span class="has-text-warning">Fire</span> Early <span class="has-text-warning">Warning</span> System for Indonesia
        </h2>
        <br>
        <br>
      </div>
    </section>

    <section class="section">
      <div class="container has-text-centered is-size-3">
        <div class="content is-medium">
          Extreme peat burning events in Indonesia, like the 2015 episode seen in the MODIS image of Sumatra and Borneo islands above, emit vast amounts of greenhouse gasses and have adverse effects on human health and ecosystems. <strong>ToFEWSI</strong> is developing a suite of climate-, hydrological- and agent-based modelling tools at landscape to regional-scales to predict the incidence of peat and forest fires in Indonesia. The project will help Indonesia to reduce local fire impacts and regional haze pollution, and meet its commitments under the ASEAN Agreement on Transboundary Haze Pollution and the Paris Climate Agreement on emissions reduction.
        </div>
      </div>
    </section>
    <section>
        <div class="container">
    <div class="is-divider"></div>
</div>
    </section>
    <section class="section">
      <div class="container has-text-centered is-size-3">
        <div class="content is-medium">
          <strong>ToFEWSI</strong> is an international and multidisciplinary project involving researchers with diverse backgrounds from organizations located in Indonesia, UK and Canada. Among us we have experts in wildfire modelling, peatland hydrology, ecological modelling, earth observation, climate change, meteorology and many more. Meet the <nuxt-link to="/team">ToFEWSI team</nuxt-link>.
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {}
</script>

<style>
.bg {
  /* The image used */
  background-image: url('../assets/borneo_20.jpg');

  /* Full height */
  height: 100%;

  /* Center and scale the image nicely */
  background-position: right bottom;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
