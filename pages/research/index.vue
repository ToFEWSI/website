<template>
  <div class="section">
    <br>
    <div class="container is-desktop">
        <h1 class="title">
          ToFEWSI research
        </h1>

        <br><br>
        <div class="content is-medium">
            The project coordinates several interlinked research projects, all of which aim to improve knowledge of Indonesian peatland and forest fires. ToFEWSI research outputs are listed bellow:
        </div>
        <div>
            <div v-for="rea in reaitems" :key="rea.id">
              <Research :rea="rea" />
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import reaitems from '@/assets/researches.json'
import Research from '@/components/Research.vue'

export default {
  components: {
    Research: Research
  },
  data() {
    return {
      reaitems
    }
  }
}
</script>

