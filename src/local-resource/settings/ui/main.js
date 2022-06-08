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
    quickCommandList: [getDefaultValue()], //
  },
  mounted() {
    this.title = `${this.$config.itemData.id}`;
    const findObj = _.find(this.$config.quickCommandList, (item) => {
      return item.path === this.$config.itemData.spath;
    });
    if (findObj) {
      this.shortcuts = findObj.shortcuts;
      this.quickCommandList = findObj.data;
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
      vscode.postMessage({
        type: "quickCommandList",
        quickCommandList: val,
        itemData: this.$config.itemData,
      });
    },
  },
  methods: {
    handleAdd() {
      this.quickCommandList = _.concat(
        this.quickCommandList,
        getDefaultValue()
      );
    },
    handleDelete(item) {
      this.quickCommandList = _.filter(
        this.quickCommandList,
        (obj) => obj.id !== item.id
      );
    },
    handleChecked(e, item) {
      this.quickCommandList = _.map(this.quickCommandList, (obj) => {
        if (obj.id === item.id) {
          obj.checked = e.target.checked;
        }
        return obj;
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
    handleCommand(e, item) {
      this.quickCommandList = _.map(this.quickCommandList, (obj) => {
        if (obj.id === item.id) {
          obj.command = e.target.value;
        }
        return obj;
      });
    },
  },
});
