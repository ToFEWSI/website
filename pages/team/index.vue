<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        ToFEWSI team
      </h1>
      <div class="columns is-multiline is-centered">
        <div v-for="bio in bios" :key="bio.id" class="column is-half">
          <Person :bio="bio" />
        </div>
      </div>
    </div>
    </div>
    </div>
  </section>
</template>
 <script>
import bios from '@/assets/people.json'
import Person from '@/components/People.vue'

export default {
  components: {
    Person: Person
  },
  data() {
    return {
      bios
    }
  }
}
</script>
