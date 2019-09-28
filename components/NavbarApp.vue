<template>
  <nav class="navbar is-light is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <nuxt-link to="/" class="navbar-item" active-class="is-active" exact @click.native="toggleBurger">
        <h1 class="is-size-5">
          <strong>ToFEWSI</strong>
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
            Data products
          </a>

          <div class="navbar-dropdown">
            <nuxt-link to="/hindcasts" class="navbar-item" active-class="is-active" exact @click.native="toggleBurger">
            Hindcasts 
            </nuxt-link>
            <nuxt-link to="/forecasts" class="navbar-item" active-class="is-active" exact @click.native="toggleBurger">
              Forecasts
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a target="_blank" class="button is-info" href="https://twitter.com/intent/follow?screen_name=ToFEWSI">
                <span class="icon"><i class="fab fa-twitter"></i></span>
                <span>Follow @ToFEWSI</span>
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
