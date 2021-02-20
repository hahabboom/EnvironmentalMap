<template>
  <div id="app">
    <map-content></map-content>
  </div>
</template>

<script>

import MapContent from "@/components/mapContent";
export default {
  name: 'App',
  components: { MapContent }
}
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
}
</style>
