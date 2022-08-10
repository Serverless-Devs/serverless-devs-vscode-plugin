const vscode = acquireVsCodeApi();

new Vue({
  el: "#app",
  data: {
    currentAppParams: {},
    paramRequired: {},
    configItems: {}
  },
  created() {
    this.init();
  },
  mounted() {
    window.addEventListener('message', event => {
      if(event.data.command === 'updatePath') {
        this.configItems = _.omit(this.configItems, 'path');
        this.configItems.path = event.data.path;
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener('message', this.onMessage);
  },
  methods: {
    init() {
      this.currentAppParams = this.$config.params.properties;
      this.paramRequired = this.$config.params.required;
      this.configItems.path = this.$config.defaultPath;
      this.configItems.dirName = this.$config.templateName;
      for (const i in this.currentAppParams) {
        this.configItems[i] = this.currentAppParams[i]['default'];
      }
    },
    isRequire(name) {
      return this.paramRequired.indexOf(name) > -1;
    },
    setInitPath() {
      vscode.postMessage({
        command: 'setInitPath',
      });
    },
    setConfigItem(name, event) {
      if (event.target.currentValue.length === 0) {
        this.configItems[name] = this.currentAppParams[name]['default'];
      } else {
        this.configItems[name] = event.target.currentValue;
      }
    },
    initApplication() {
      vscode.postMessage({
        command: 'initApplication',
        access: this.$config.access,
        templateName: this.$config.templateName,
        configItems: this.configItems,
      });
    },
    onMessage(event) {
      
    }
  }
});