import * as vscode from "vscode";

export function hello(params) {
  vscode.window.showInformationMessage(params.message);
}
