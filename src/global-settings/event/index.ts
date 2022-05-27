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
  //  TODO:
}
