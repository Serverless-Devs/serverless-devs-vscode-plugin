import * as vscode from "vscode";
import { getHtmlForWebview } from "../common";
import { hello } from "./event";

// init app-center webview
let appCenterWebviewPanel: vscode.WebviewPanel | undefined;
export function appCenter(context: vscode.ExtensionContext) {
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
      handleMessage,
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

function handleMessage(params: { type: string; message: string }) {
  switch (params.type) {
    case "hello":
      hello(params);
      return;
  }
}
