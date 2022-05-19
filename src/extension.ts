// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ProjectTreeProvider } from "./projectView/provider";
import { init } from "./globalCommand/init";
import { config } from "./globalCommand/config";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  // s init
  vscode.commands.registerCommand("serverless-devs.init", () => init(context));

  // s config add
  vscode.commands.registerCommand("serverless-devs.config", () =>
    config(context)
  );

  const depNodeProvider = new ProjectTreeProvider(rootPath);
  vscode.window.registerTreeDataProvider("localResource", depNodeProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {}
