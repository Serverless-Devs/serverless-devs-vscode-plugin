const vscode = acquireVsCodeApi();

new Vue({
  el: "#app",
  data: {},
  methods: {
    handleAnalysis(e) {
      vscode.postMessage({
        type: "analysis",
        checked: e.target.checked,
      });
    },
    handleManageWorkspace() {
      vscode.postMessage({
        type: "manageWorkspace",
      });
    },
    handleResetWorkspace() {
      vscode.postMessage({
        type: "resetWorkspace",
      });
    },
  },
});
