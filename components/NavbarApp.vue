<template>
  <nav class="navbar is-light" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <nuxt-link to="/" class="navbar-item" active-class="is-active" exact @click.native="toggleBurger">
        <h1 class="is-size-5">
          <strong>ToFEWSI </strong><i class="fas fa-home" />
        </h1>
      </nuxt-link>
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navMenu"
        :class="{ 'is-active': activator }"
        @click="makeBurger"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <div id="navMenu" class="navbar-menu" :class="{ 'is-active': activator }">
      <div class="navbar-start">
        <nuxt-link to="/team" class="navbar-item" active-class="is-active" exact @click.native="toggleBurger">
          Team
        </nuxt-link>


        <nuxt-link to="/research" class="navbar-item" active-class="is-active" exact @click.native="toggleBurger">
          Research
        </nuxt-link>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Data maps
          </a>

          <div class="navbar-dropdown">
            <nuxt-link to="/maps" class="navbar-item" active-class="is-active" exact @click.native="toggleBurger">
              Forecasts
            </nuxt-link>

            <nuxt-link to="/maps_panzoom" class="navbar-item" active-class="is-active" exact @click.native="toggleBurger">
              Model compare
            </nuxt-link>
            <hr class="navbar-divider">
            <a class="navbar-item">
              Report an issue
            </a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary" href="https://twitter.com/hashtag/ToFEWSI?src=hash">
              <i class="fab fa-twitter" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'NavbarApp',
  data() {
    return {
      msg: '',
      activator: false
    }
  },
  methods: {
    makeBurger() {
      this.activator = !this.activator
      console.log('burger', this.activator)
      return this.activator
    },
    toggleBurger() {
      if (this.activator) {
        this.activator = !this.activator
      }
    }
  }
}
</script>
<style lang="scss">
.ymca {
  color: $primary; // will be resolved to #333
}
</style>
