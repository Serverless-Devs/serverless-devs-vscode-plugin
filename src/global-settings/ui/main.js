const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function main() {
  // 数据收集
  const analysis = document.getElementById("analysis");
  analysis.onclick = function (e) {
    vscode.postMessage({
      type: "analysis",
      checked: e.target.checked,
    });
  };
  // 配置默认路径
  const resetWorkspace = document.getElementById("resetWorkspace");
  resetWorkspace.onclick = function (e) {
    vscode.postMessage({
      type: "resetWorkspace",
    });
  };
  // 配置默认路径
  const mangeWorkspace = document.getElementById("mangeWorkspace");
  mangeWorkspace.onclick = function (e) {
    vscode.postMessage({
      type: "mangeWorkspace",
    });
  };
}
