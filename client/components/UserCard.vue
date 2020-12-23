<template>
  <v-card class="mt-10">
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-title class="headline" v-text="user.username"></v-card-title>
        <v-card-subtitle v-text="user.email"></v-card-subtitle>
        <v-card-actions>
          <v-btn
            class="ml-2 mt-5"
            outlined
            rounded
            small
            @click="onClick(user)"
          >
            {{ actionName }}
          </v-btn>
        </v-card-actions>
      </div>
      <v-avatar class="ma-3" size="125" tile>
        <v-img src="https://randomuser.me/api/portraits/women/84.jpg"></v-img>
      </v-avatar>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    onClick: {
      type: Function,
      required: true,
    },
    actionName: {
      type: String,
      required: true,
    },
  },
}
</script>

<style></style>
