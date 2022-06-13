const vscode = acquireVsCodeApi();

function getImage(type, isDark) {
  switch (type) {
    case "deploy":
      return isDark
        ? "https://img.alicdn.com/imgextra/i3/O1CN01ZOhLYo1Rvjo3ZJqZJ_!!6000000002174-55-tps-16-16.svg"
        : "https://img.alicdn.com/imgextra/i3/O1CN01BtNlJq1w6DLASrvHV_!!6000000006258-55-tps-16-16.svg";
    case "build":
      return isDark
        ? "https://img.alicdn.com/imgextra/i4/O1CN01ZnLmAt1m5AH5TxdCf_!!6000000004902-2-tps-16-16.png"
        : "https://img.alicdn.com/imgextra/i1/O1CN01VUgjJx1kEfG9jD4vn_!!6000000004652-2-tps-16-16.png";

    case "invoke":
      return isDark
        ? "https://img.alicdn.com/imgextra/i4/O1CN017xT3OU22B9Iu1cp5W_!!6000000007081-55-tps-16-16.svg"
        : "https://img.alicdn.com/imgextra/i4/O1CN01Tno0SH1oJ1UTq1PWB_!!6000000005203-55-tps-16-16.svg";
  }
}

new Vue({
  el: "#app",
  data: {
    title: "",
    titleInEditing: "",
    isEditTitle: false,
    shortcuts: [],
    quickCommandList: [], //
    invokePicture: "",
  },
  computed: {
    showEditBtn() {
      return this.$config.itemData.contextValue === "app";
    },
    extraTitle() {
      if (this.$config.itemData.contextValue === "app") {
        return `(${this.$config.itemData.spath})`;
      }
      return `(${this.$config.itemData.spath}) > ${this.$config.itemData.label}`;
    },
  },
  mounted() {
    this.title = this.titleInEditing = this.$config.itemData.alias;
    this.quickCommandList = this.$config.quickCommandList;
    this.$nextTick(() => {
      const body = document.getElementById("devsContainer");
      const isDark = _.includes(body.className, "vscode-dark");
      this.invokePicture = getImage("invoke", isDark);
      this.shortcuts = _.isEmpty(this.$config.shortcuts)
        ? [
            {
              id: _.uniqueId(),
              icon: getImage("deploy", isDark),
              command: "deploy",
            },
            {
              id: _.uniqueId(),
              icon: getImage("build", isDark),
              command: "build",
            },
            {
              id: _.uniqueId(),
              icon: this.invokePicture,
              command: "invoke",
            },
          ]
        : this.$config.shortcuts;
    });
  },
  watch: {
    shortcuts: function (val, oldVal) {
      vscode.postMessage({
        type: "shortcuts",
        shortcuts: val,
        itemData: this.$config.itemData,
      });
    },
    quickCommandList: function (val, oldVal) {
      const quickCommandList = _.map(
        _.filter(val, (item) => item.args),
        (item) => ({
          command: item.command,
          args: item.args,
        })
      );
      vscode.postMessage({
        type: "quickCommandList",
        quickCommandList,
        itemData: this.$config.itemData,
      });
    },
  },
  methods: {
    handleCancelTitle() {
      this.titleInEditing = this.title;
      this.isEditTitle = false;
    },
    handleConfirmTitle() {
      if (_.isEmpty(this.titleInEditing)) {
        return vscode.postMessage({
          type: "empty",
        });
      }
      this.title = this.titleInEditing;
      this.isEditTitle = false;
      vscode.postMessage({
        type: "handleConfirmTitle",
        title: this.title,
        itemData: this.$config.itemData,
      });
    },
    handleShortcutsArgs(e, item) {
      this.shortcuts = _.map(this.shortcuts, (obj) => {
        if (obj.id === item.id) {
          obj.args = e.target.value;
        }
        return obj;
      });
    },
    handleArgs(e, item) {
      this.quickCommandList = _.map(this.quickCommandList, (obj) => {
        if (obj.id === item.id) {
          obj.args = e.target.value;
        }
        return obj;
      });
    },
    handleOperate(item) {
      const { itemData } = this.$config;
      let command =
        itemData.contextValue === "app"
          ? `s ${item.command}`
          : `s ${itemData.label} ${item.command}`;

      if (item.args) {
        command = `${command} ${item.args}`;
      }
      vscode.postMessage({
        type: "handleOperate",
        command,
      });
    },
  },
});
