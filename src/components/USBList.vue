<template>
  <div class="hello">
    <h1 v-if="drives.length">{{ msg }}</h1>
    <h1 v-else>USB-носителей не обнаружено</h1>
    <ul>
      <li v-for="(drive, i) in drives" :key="i">
        <input type="checkbox" v-model="drive.checked" />
        {{ i + 1 }} {{ drive.description }}
      </li>
    </ul>
    <button @click="getDrives">Refresh list USB</button>
    <h2 v-if="loading">Loading...</h2>
    <div v-else class="form">
      <input :disabled="!drives.length" type="text" v-model="message" />
      <button :disabled="!drives.length" @click="writeMessage">
        Write USB
      </button>
    </div>
    <h2 v-if="sending === 'send'">Write successful!</h2>
    <h2 v-if="sending === 'error'">Error!</h2>
  </div>
</template>

<script lang="ts">
import { usb } from "usb";
import Vue from "vue";
const drivelist = require("drivelist");
const fs = require("fs");

export default Vue.extend({
  name: "USBList",
  props: {
    msg: String,
  },
  data() {
    return {
      drives: [] as any[],
      message: "",
      loading: false,
      sending: null as string | null,
    };
  },
  methods: {
    getDrives() {
      this.drives = drivelist
        .list()
        .then((data: any[]) => {
          this.drives = data.filter((el) => el.isUSB);
          this.drives.forEach((el) => {
            return { ...el, checked: false };
          });
        })
        .catch((err: any) => console.error(err));
    },
    writeFile(indexUSB: number) {
      fs.writeFile(
        `${this.drives[indexUSB].mountpoints[0].path}/electron/logs.txt`,
        this.message,
        (err: any) => {
          if (err) {
            this.sending = "error";
            throw new Error(err);
          }
          this.sending = "send";
          this.loading = false;
          this.message = "";
        }
      );
    },
    writeMessage() {
      for (let i = 0; i < this.drives.length; i++) {
        if (this.drives[i].checked) {
          this.loading = true;
          fs.access(
            `${this.drives[i].mountpoints[0].path}/electron`,
            (err: any) => {
              if (err && err.code === "ENOENT") {
                fs.mkdirSync(`${this.drives[i].mountpoints[0].path}/electron`);
                this.writeFile(i);
              }
              this.writeFile(i);
            }
          );
        }
      }
    },
  },
  mounted() {
    this.getDrives();
    usb.addListener("attach", () => setTimeout(this.getDrives, 5000));
    usb.addListener("detach", this.getDrives);
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  box-sizing: border-box;
}
h3 {
  margin: 40px 0 0;
}
ul {
  width: 80%;
  margin: 0 auto;
  list-style-type: none;
  padding: 0;
}
li {
  display: block;
  margin: 10px 30px;
  text-align: left;
}
a {
  color: #42b983;
}
button {
  padding: 10px 15px;
  margin-bottom: 20px;
  outline: none;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

input {
  padding: 10px 15px;
  margin-right: 10px;
  font-size: 14px;
  border-radius: 5px;
  border: #42b983 1px solid;
  outline: none;
}
</style>
