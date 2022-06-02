import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";
import * as core from "@serverless-devs/core";

export async function analysis(params) {
  await core.setConfigYaml("analysis", params.checked ? "enable" : "disable");
  vscode.window.showInformationMessage("Setup succeeded");
}

export async function resetWorkspace() {
  const filePath = path.join(os.homedir(), ".s");
  core.setConfig("workspace", filePath);
  vscode.window.showInformationMessage("Setup succeeded");
}

export async function mangeWorkspace() {
  const options: vscode.OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: "Open",
    defaultUri: vscode.Uri.file(core.getRootHome()),
  };
  const selectFolderUri = await vscode.window.showOpenDialog(options);
  if (selectFolderUri) {
    const { fsPath } = selectFolderUri[0];
    core.setConfig("workspace", fsPath);
    vscode.window.showInformationMessage("Setup succeeded");
  }
}
