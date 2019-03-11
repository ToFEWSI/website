<template>
  <body>
    <section class="hero is-large bg">
      <div class="hero-body" />
      <div class="hero-foot">
        <div class="container has-text-centered">
          <h1 class="title has-text-white is-size-1">
            Project
            To<span class="has-text-danger">F</span>E<span class="has-text-warning">W</span>SI
          </h1>
          <h2 class="subtitle has-text-white is-size-3">
            Towards a  <span class="has-text-danger">Fire</span> Early <span class="has-text-warning">Warning</span> System for Indonesia
          </h2>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container has-text-centered is-size-3">
        <h1 class="title is-size-2">
          Project
          To<span class="has-text-danger">F</span>E<span class="has-text-danger">W</span>SI
        </h1>
        <h2 class="subtitle  has-text-grey is-size-3">
          Towards a  <span class="has-text-danger">Fire</span> Early <span class="has-text-danger">Warning</span> System for Indonesia
        </h2>
        <br>
        <div class="content is-medium">
          Extreme peat burning events in Indonesia, like the 2015 episode seen in the MODIS image of Sumatra and Borneo islands above, emit vast amounts of greenhouse gasses and have adverse effects on human health and ecosystems. ToFEWSI is developing a suite of climate-, hydrological- and agent-based modelling tools at landscape to regional-scales to predict the incidence of peat forest fires in Indonesia.  ToFEWSI will help Indonesia to reduce local fire impacts and regional haze pollution, and meet its commitments under the ASEAN Agreement on Transboundary Haze Pollution and the Paris Climate Agreement on emissions reduction. <a class="button is-primary is-outlined is-small">Read more</a>
        </div>

        <br>
        <hr>
      </div>
      </div>
    </section>
    <section class="section">
      <div class="container has-text-centered is-size-3">
        <div class="content is-medium">
          <strong>ToFEWSI</strong> is an international and multidisciplinary project involving researchers with diverse backgrounds from organizations located in Indonesia, UK and Canada. Among us we have experts in wildfire modelling, peatland hydrology, ecological modelling, earth observation, climate change, meteorology and many more. <nuxt-link to="/team" class="button is-primary is-outlined is-small nuxt-lind">
            Meet the team
          </nuxt-link>
        </div>
      </div>
      </div>
    </section>
  </body>
</template>
<script>
export default {}
</script>

<style>
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
</style>
