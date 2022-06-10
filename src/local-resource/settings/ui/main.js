const vscode = acquireVsCodeApi();
new Vue({
  el: "#app",
  data: {
    title: "",
    titleInEditing: "",
    isEditTitle: false,
    shortcuts: [
      {
        id: _.uniqueId(),
        icon: "debug-start",
        command: "deploy",
      },
      {
        id: _.uniqueId(),
        icon: "debug-start",
        command: "build",
      },
      {
        id: _.uniqueId(),
        icon: "debug-start",
        command: "invoke",
      },
    ],
    quickCommandList: [], //
  },
  computed: {
    showEditBtn() {
      return this.$config.itemData.contextValue === "app";
    },
  },
  mounted() {
    this.title = this.titleInEditing = this.$config.itemData.alias;
    this.quickCommandList = this.$config.quickCommandList;
    if (!_.isEmpty(this.$config.shortcuts)) {
      this.shortcuts = this.$config.shortcuts;
    }
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
