<template>
  <div class="card has-equal-height">
    <div class="card-content">
      <div class="media-content">
        <p class="title is-4">
          {{ bio.FullName }}
        </p>
        <p class="subtitle is-6">
          {{ bio.Affiliation }} at {{ bio.Institution }}
        </p>
      </div>
    </div>
    <div class="notification has-equal-height has-background-light">
      {{ bio.bio }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bio: Object
  }
}
</script>
<style>
.has-equal-height {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.has-equal-height .card-footer {
  margin-top: auto;
}
</style>
