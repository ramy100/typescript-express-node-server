<template>
  <div>
    <v-container fluid class="pb-15">
      <v-row justify="center" class="text-center py-15">
        <h1>Logo Here</h1>
      </v-row>
      <v-row justify="center" class="text-center py-5">
        <span class="font-weight-light">{{ title }} With</span>
      </v-row>
      <v-row justify="center" class="text-center">
        <company-button
          v-for="company in companyButtonOptions"
          :key="company.name"
          :icon="company.icon"
          :color="company.color"
          class="mx-2"
        />
      </v-row>
      <v-row justify="center" class="text-center py-5">
        <span class="font-weight-light">or {{ title }} with Email</span>
      </v-row>
      <v-row justify="center" class="text-center">
        <v-card min-width="50%" :loading="loading">
          <div class="pt-9">
            <v-card-text>
              <slot name="form-fields" />
            </v-card-text>
          </div>
          <v-card-actions>
            <slot name="form-actions" />
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CompanyButton from './companyButton.vue'
export default {
  name: 'LoginRegister',
  components: { CompanyButton },
  props: {
    title: {
      type: String,
      required: true,
    },
    companyButtonOptions: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style></style>
