// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ext } from "./extensionVariables";
import { ProjectTreeProvider } from "./projectView/provider";
import { init } from "./globalCommand/init";
import { config } from "./globalCommand/config";
import { TestView } from "./projectView/testView";

export function activate(context: vscode.ExtensionContext) {
  ext.context = context;
  ext.cwd =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  // s init
  vscode.commands.registerCommand("serverless-devs.init", () => init());

  // s config add
  vscode.commands.registerCommand("serverless-devs.config", () => config());

  ext.localResource = new ProjectTreeProvider();
  vscode.window.registerTreeDataProvider("localResource", ext.localResource);

  vscode.commands.registerCommand("serverless-devs.refresh", () => {
    ext.localResource.refresh();
  });

  new TestView(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
