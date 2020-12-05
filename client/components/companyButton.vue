<template>
  <button text class="button" :style="cssVars">
    <div class="inner-wrapper"></div>
    <v-icon class="icon">{{ icon }}</v-icon>
  </button>
</template>

<script>
export default {
  name: 'CompanyButton',
  props: {
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  computed: {
    cssVars() {
      return {
        '--color': this.color,
      }
    },
  },
}
</script>

<style lang="scss">
.button {
  position: relative;
  width: 60px;
  height: 40px;
  border-radius: 5px;
  &:hover {
    background-color: var(--color);
    .icon {
      color: white;
    }
  }
  &:focus {
    outline: none;
  }
  transition: 0.8s;
}
.inner-wrapper {
  border-radius: 0 0 5px 5px;
  background-color: var(--color);
  width: 100%;
  height: 20%;
  position: absolute;
  bottom: 0;
}
</style>
