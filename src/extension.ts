// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ext } from "./extensionVariables";
import { LocalResource } from "./local-resource";
import { init } from "./commands/init";
import { config } from "./commands/config";
import { TestView } from "./local-resource/testView";
import { testWebview } from "./local-resource/testWebview";
import { statusBarItem } from "./status/statusBarItem";
import { activeAppCenterWebview } from "./app-center";

export function activate(context: vscode.ExtensionContext) {
  ext.context = context;
  ext.cwd =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  // s init
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.init", () => init())
  );
  // s config add
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.config", () => config())
  );

  ext.localResource = new LocalResource();
  const localResourceTreeView = vscode.window.createTreeView("localResource", {
    treeDataProvider: ext.localResource,
  });

  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.refresh", () => {
      ext.localResource.refresh();
    })
  );

  new TestView(context);
  testWebview(context);
  statusBarItem(context);
  // app-center webview
  activeAppCenterWebview(context);
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.helloWorld", () => {
      activeAppCenterWebview(context);
    })
  );
  localResourceTreeView.onDidChangeVisibility(({ visible }) => {
    if (visible) {
      // vscode.commands.executeCommand("catCoding.start");
      vscode.commands.executeCommand("serverless-devs.helloWorld");
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
