import Vue from 'vue'
import Router from 'vue-router'

import DeveryMain from './components/pages/DeveryMain';
import Login from './components/pages/Login';
import Confirm from './components/pages/Confirm';
import MailConfirmationInfo from './components/pages/MailConfirmationInfo';

import store from './store';

Vue.use(Router);
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/devery',
      name: 'devery',
      component: DeveryMain,
      meta: {
        isAuthRequired: true,
      }
    },
    {
      path: '/confirmations/mail',
      name: 'mailInfo',
      component: MailConfirmationInfo,
      meta: {
        isConfirmRequired: true
      }
    },
    {
      path: '/confirmations/:id',
      name: 'confirm',
      component: Confirm,
      meta: {
        isConfirmRequired: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  return Promise.resolve()
    .then(() => {
      if (to.name === 'login') {
        if (store.auth.haveToken) {
          if (store.auth.isMeLoaded) {
            return next('/devery')
          }
          return store.auth.getMe()
            .then(() => {
              return next('/devery')
            })
            .catch(() => {
              store.auth.logout();
              return next()
            })
        }
        return next();
      }
      if (to.meta.isAuthRequired) {
        if (store.auth.haveToken) {
          if (store.auth.isMeLoaded) {
            return next()
          }
          return store.auth.getMe()
            .then(() => {
              return next()
            })
            .catch(() => {
              store.auth.logout();
              return next('/')
            })
        }
        return next('/')
      }
      if (to.meta.isConfirmRequired) {
        if (store.auth.isConfirming) {
          return next()
        }
        return next('/')
      }
    })
});

export default router;
