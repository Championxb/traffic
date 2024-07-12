import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import router from "@/router";
import { createPinia } from "pinia";
import ScaleScreen from "@/components/scale-screen/scale-screen.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import dataV from "@jiaminghi/data-view";
import Echarts from "./utils/Ehcarts";
import Message from "@/utils/Message.js";

import ItemWrap from "@/components/item-wrap.vue";
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component("ScaleScreen", ScaleScreen);
app.component("ItemWrap", ItemWrap);

app.config.globalProperties.Message = Message;
app.config.globalProperties.Echarts = Echarts;
const pinia = createPinia();

app.use(pinia);
app.use(dataV);
app.use(router);
app.mount("#app");
