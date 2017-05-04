<template lang="html">
  <div class="App-nav__Wrapper__Left">
    <nuxt-link class="App-nav__Wrapper__Left__button" to="/" title="Home" exact>
      @root
    </nuxt-link>

    <nuxt-link class="App-nav__Wrapper__Left__button" to="/articles" title="Articles" exact>
      ::all()
    </nuxt-link>

    <nuxt-link class="App-nav__Wrapper__Left__button" to="/about" title="About Me">
      self::
    </nuxt-link>

    <nuxt-link class="App-nav__Wrapper__Left__button" to="/contact" title="Contact Me">
      Mail::
    </nuxt-link>
  </div>
</template>
