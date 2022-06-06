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
    console.log(_, "lodash");
  },
  methods: {
    handleAdd() {
      this.commands.push(getDefaultValue());
      console.log(this.commands);
    },
    handleChecked(e, item) {
      this.commands = _.map(this.commands, (obj) => {
        if (obj.id === item.id) {
          item.checked = e.target.checked;
        }
        return item;
      });
    },
  },
});
