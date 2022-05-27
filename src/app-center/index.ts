import * as vscode from "vscode";
import { getHtmlForWebview } from "../common";
import * as event from "./event";
import * as core from "@serverless-devs/core";

// init app-center webview
let appCenterWebviewPanel: vscode.WebviewPanel | undefined;
export async function activeAppCenterWebview(context: vscode.ExtensionContext) {
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
    async function updateWebview() {
      appCenterWebviewPanel.webview.html = getHtmlForWebview(
        "app-center",
        context,
        appCenterWebviewPanel.webview,
        {
          analysis: await core.getSetConfig("analysis"),
          workspace: core.getRootHome(),
        }
      );
    }
    await updateWebview();
    appCenterWebviewPanel.iconPath = vscode.Uri.parse(
      "https://img.alicdn.com/imgextra/i4/O1CN01AvqMOu1sYpY1j8xaI_!!6000000005779-2-tps-574-204.png"
    );
    appCenterWebviewPanel.webview.onDidReceiveMessage(
      (val) => handleMessage(val, updateWebview),
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

async function handleMessage(
  params: { type: string; [key: string]: any },
  updateWebview: () => Promise<void>
) {
  switch (params.type) {
    case "analysis":
      await event.analysis(params);
      return;
    case "resetWorkspace":
      await event.resetWorkspace();
      await updateWebview();
      return;
    case "mangeWorkspace":
      await event.mangeWorkspace();
      await updateWebview();
      return;
  }
}
