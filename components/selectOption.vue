<template>
        <div class="field">
          <div class="control">
          <div class="select is-primary" 
              v-click-outside="hide">
              <select v-model="selOption">
                  <option v-for="option in options" @click="changeOption(option)">
                  {{ option }}
                  </option>
              </select>
          </div>
        </div>
      </div>
</template>

<script>
import vClickOutside from 'v-click-outside'

export default {

    directives: {
          clickOutside: vClickOutside.directive
    },

    props: {
        options: Array,
        selected: String
    },
    data() {
        return {
            selOption: this.selected,
            isActive: false,
        }
    },
    mounted() {
    },

    methods: {
    hide() {
        if (this.isActive) {
            this.isActive = false
        }
    },
    changeOption(option) {
        console.log('option changed', option)
        this.$emit('updateOption', option);
    }
    }
}
</script>
    
