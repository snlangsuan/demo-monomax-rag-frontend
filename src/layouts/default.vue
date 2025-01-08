<template>
  <v-app id="default">
    <v-main>
      <slot />
    </v-main>
    <custom-dialog />
    <custom-loader />
  </v-app>
</template>