// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ext } from "./extensionVariables";
import { ProjectTreeProvider } from "./views/provider";
import { init } from "./commands/init";
import { config } from "./commands/config";
import { TestView } from "./views/testView";
import { webviewTest } from "./views/webviewTest";
import { statusBarItem } from "./status-bar/statusBarItem";
import { getHtmlForWebview } from "./webview/getHtmlForWebview";

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

  // init config webview
  let configWebviewPanel: vscode.WebviewPanel | undefined;
  function activeConfigWebview() {
    if (configWebviewPanel) {
      configWebviewPanel.reveal();
    } else {
      configWebviewPanel = vscode.window.createWebviewPanel(
        "Serverless-Devs",
        "设置 - Serverless-Devs",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );
      configWebviewPanel.webview.html = getHtmlForWebview(
        "hello",
        context,
        configWebviewPanel.webview
      );
      configWebviewPanel.iconPath = vscode.Uri.parse(
        "https://img.alicdn.com/imgextra/i4/O1CN01AvqMOu1sYpY1j8xaI_!!6000000005779-2-tps-574-204.png"
      );

      configWebviewPanel.onDidDispose(
        () => {
          configWebviewPanel = undefined;
        },
        null,
        context.subscriptions
      );
    }
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.helloWorld", () => {
      activeConfigWebview();
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
