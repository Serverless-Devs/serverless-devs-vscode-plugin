const vscode = acquireVsCodeApi();

new Vue({
  el: '#app',
  computed: {
    componentAll() {
      return this.$config.componentAll;
    }
  },
  methods: {
    deleteComponent(component) {
      vscode.postMessage({
        command: 'deleteComponent',
        component: component
      });
    }
  }
});