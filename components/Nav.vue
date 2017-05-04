<template lang="html">
  <nav class="App-nav">
    <div class="App-nav__Wrapper">
      <leftNav />

      <rightNav />

      <div class="Clear"/>
    </div>
  </nav>
</template>


<script type="text/javascript">
  import leftNav from '~components/_nav/_left-nav.vue'
  import rightNav from '~components/_nav/_right-nav.vue'
  export default { components: { leftNav, rightNav } }
</script>
