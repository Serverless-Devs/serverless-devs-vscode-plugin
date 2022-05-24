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
import { getHtmlForWebview } from "./common";
import appCenterEvent from "./app-center/event/index";

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

  // init app-center webview
  let appCenterWebviewPanel: vscode.WebviewPanel | undefined;
  function activeAppCenterWebview() {
    if (appCenterWebviewPanel) {
      appCenterWebviewPanel.reveal();
    } else {
      appCenterWebviewPanel = vscode.window.createWebviewPanel(
        "Serverless-Devs",
        "设置 - Serverless-Devs",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );
      appCenterWebviewPanel.webview.html = getHtmlForWebview(
        "app-center",
        context,
        appCenterWebviewPanel.webview
      );
      appCenterWebviewPanel.iconPath = vscode.Uri.parse(
        "https://img.alicdn.com/imgextra/i4/O1CN01AvqMOu1sYpY1j8xaI_!!6000000005779-2-tps-574-204.png"
      );
      appCenterWebviewPanel.webview.onDidReceiveMessage(
        appCenterEvent,
        undefined,
        context.subscriptions
      );
      appCenterWebviewPanel.onDidDispose(
        () => {
          appCenterWebviewPanel = undefined;
        },
        null,
        context.subscriptions
      );
    }
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.helloWorld", () => {
      activeAppCenterWebview();
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
