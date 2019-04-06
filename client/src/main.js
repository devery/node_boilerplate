import Vue from 'vue';
import antd from 'ant-design-vue';

import App from './App.vue';
import router from './router';

import "ant-design-vue/dist/antd.css";
import "./styles/app.scss";
import "./styles/less.less";

Vue.use(antd);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
