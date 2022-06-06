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
    commands: [getDefaultValue()],
  },
  mounted() {
    if (this.$config.commands.length > 0) {
      this.commands = this.$config.commands;
    }
  },
  watch: {
    commands: function (val, oldVal) {
      console.log(val, oldVal);
      vscode.postMessage({
        type: "commands",
        commands: this.commands,
      });
    },
  },
  methods: {
    handleAdd() {
      this.commands = _.concat(this.commands, getDefaultValue());
    },
    handleDelete(item) {
      this.commands = _.filter(this.commands, (obj) => obj.id !== item.id);
    },
    handleChecked(e, item) {
      this.commands = _.map(this.commands, (obj) => {
        if (obj.id === item.id) {
          obj.checked = e.target.checked;
        }
        return obj;
      });
    },
    handleArgs(e, item) {
      this.commands = _.map(this.commands, (obj) => {
        if (obj.id === item.id) {
          obj.args = e.target.value;
        }
        return obj;
      });
    },
  },
});
