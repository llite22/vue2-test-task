<template>
  <v-app>
    <v-app-bar app>
      <router-link to="/one">
        <v-btn text>Tab One</v-btn>
      </router-link>
      <router-link to="/two">
        <v-btn text>Tab Two</v-btn>
      </router-link>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>


<script>
export default {
  name: "App",
};
</script>
