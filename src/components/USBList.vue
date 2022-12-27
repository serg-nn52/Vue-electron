<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="(USB, i) in USBList" :key="i">{{ i + 1 }} {{ USB }}</li>
    </ul>
    <h3 v-if="newDevise">Add new device {{ newDevise }}</h3>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ipcRenderer } from "electron";
import { usb } from "usb";

export default Vue.extend({
  name: "USBList",
  props: {
    msg: String,
  },
  data() {
    return {
      USBList: [] as usb.Device[],
      newDevise: null as usb.Device | null,
    };
  },
  mounted() {
    ipcRenderer.on("mainchannel", (_, data) => {
      this.USBList = data.message;
    });
    ipcRenderer.on("addNewDevise", (_, data) => {
      this.newDevise = data.message;
    });
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
