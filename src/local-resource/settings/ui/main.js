const vscode = acquireVsCodeApi();

const getDefaultValue = () => ({
  checked: false,
  command: "",
  icon: "",
  args: "",
  id: _.uniqueId(),
});

new Vue({
  el: "#app",
  data: {
    title: "",
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
  mounted() {
    this.title = `${this.$config.itemData.id}`;
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
  },
});
