import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import * as core from "@serverless-devs/core";
import { ext } from "../../../extensionVariables";

export async function handleCommands(params) {
  const filePath = path.join(ext.cwd, ".serverless-devs");
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  data["quick-commands"] = params.commands;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
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
