<script  lang="ts" setup>
import LayoutHeader from '@/components/Header.vue'
</script>

<template>
  <div id="wrap">
    <LayoutHeader />

    <div id="contents">
      <router-view />
    </div>

  </div>
</template>

<style lang="scss">
@import '@/assets/scss/index.scss';
@import '@/assets/scss/layout.scss';
</style>