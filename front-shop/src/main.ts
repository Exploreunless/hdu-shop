import { createApp } from 'vue'
import App from './App.vue'
import {store} from './store';
import { router } from './router';
import vant, { Lazyload, Dialog } from 'vant';
import 'vant/lib/index.less';

import '@/styles/index.less';

import '@/router/guard'

const app = createApp(App);
app.use(vant);
app.use(store);
// app.use(Lazyload);
app.use(router);
app.mount('#app');
