<template>
  <div id="app">
    <!--<Appbar />-->
    <Appbar />
    <router-view />
  </div>
</template>

<script>
  import { observer } from 'mobx-vue';

  import store from './store';

  import Appbar from './components/smart/Appbar';

  export default observer({
    components: {
      Appbar,
      // Router
    },
    data() {
      return {
        store
      }
    }
  })
</script>

<style>
html,
body {
	margin: 0;
	padding: 0;
	height: 100%;
}
#app {
  width: 100%;
	height: 100%;
	display: flex;
  flex-direction: column;
}
</style>
