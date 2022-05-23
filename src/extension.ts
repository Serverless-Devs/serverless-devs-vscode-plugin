// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ext } from "./extensionVariables";
import { ProjectTreeProvider } from "./projectView/provider";
import { init } from "./globalCommand/init";
import { config } from "./globalCommand/config";
import { TestView } from "./projectView/testView";
import { webviewTest } from "./projectView/webviewTest";
import { HelloWorldPanel } from "./panels/HelloWorldPanel";
import { statusBarItem } from "./status-bar/statusBarItem";

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
  const localResourceTreeView = vscode.window.createTreeView("localResource", {
    treeDataProvider: ext.localResource,
    showCollapseAll: true,
  });
  vscode.commands.registerCommand("serverless-devs.refresh", () => {
    ext.localResource.refresh();
  });

  new TestView(context);
  webviewTest(context);
  statusBarItem(context);
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.helloWorld", () => {
      HelloWorldPanel.render(context.extensionUri);
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
