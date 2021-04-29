<template>
    <div class = "section">
    <div class="container">
      <div class="columns">
        <div class="column is-narrow">
        <figure>
          <p >
            <a target="_blank" :href="`${rea.Href}`">
            <img v-bind:src="rea.Thumb"></a>
          </p>
        </figure>
        </div>
        <div class="column">
          <div class="media-content">
            <div class="content">
            <p>
            <strong>{{ rea.Title }}</strong>
            <br>
              {{ rea.What }} by <strong>{{ rea.Author }}</strong> {{ rea.How }} <strong> {{rea.Where}}</strong>
            <br>
            </p>
            <p>
                {{ rea.Description }}
              </p>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                <a class="level-item" target="_blank" :href="`https://twitter.com/share?hashtags=ToFEWSI&text=${rea.Title}`">
                    <span class="icon is-small has-text-grey"><i class="fab fa-twitter" ></i></span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
      </div>
    <div class="is-divider"></div>
    </div>
</template>
<script>
export default {
  props: {
    rea: Object
  }
}
</script>
