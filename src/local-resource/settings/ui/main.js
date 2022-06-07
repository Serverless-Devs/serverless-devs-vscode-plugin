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
    title: "命令列表",
    quickCommandList: [getDefaultValue()],
  },
  mounted() {
    this.title = `${this.$config.itemData.id}命令列表`;
    const findObj = _.find(this.$config.quickCommandList, (item) => {
      return item.path === this.$config.itemData.spath;
    });
    if (findObj) {
      this.quickCommandList = findObj.data;
    }
  },
  watch: {
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
