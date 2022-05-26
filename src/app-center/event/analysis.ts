import * as vscode from "vscode";
import * as core from "@serverless-devs/core";

export async function analysis(params) {
  await core.setConfigYaml("analysis", params.checked ? "enable" : "disable");
  vscode.window.showInformationMessage("Setup succeeded");
}
