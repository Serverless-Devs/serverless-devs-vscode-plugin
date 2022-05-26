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
}
