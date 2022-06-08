import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getHtmlForWebview } from "../../common";
import * as event from "./event";
import * as core from "@serverless-devs/core";
import { ItemData, getQuickCommandList } from "../../common";
import { ext } from "../../extensionVariables";
import { TEMPLTE_FILE } from "../../constants";

let localResourceSettingsWebviewPanel: vscode.WebviewPanel | undefined;
export async function activeLocalResourceSettingsWebview(
  context: vscode.ExtensionContext,
  itemData: ItemData
) {
  async function updateWebview() {
    localResourceSettingsWebviewPanel.webview.html = getHtmlForWebview(
      "local-resource/settings",
      context,
      localResourceSettingsWebviewPanel.webview,
      {
        quickCommandList: getQuickCommandList(),
        itemData,
      }
    );
  }
  if (localResourceSettingsWebviewPanel) {
    localResourceSettingsWebviewPanel.reveal();
    updateWebview();
  } else {
    localResourceSettingsWebviewPanel = vscode.window.createWebviewPanel(
      "Serverless-Devs",
      "设置 - Serverless-Devs",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    await updateWebview();
    localResourceSettingsWebviewPanel.iconPath = vscode.Uri.parse(
      "https://img.alicdn.com/imgextra/i4/O1CN01AvqMOu1sYpY1j8xaI_!!6000000005779-2-tps-574-204.png"
    );
    localResourceSettingsWebviewPanel.webview.onDidReceiveMessage(
      (val) => handleMessage(val, updateWebview),
      undefined,
      context.subscriptions
    );
    localResourceSettingsWebviewPanel.onDidDispose(
      () => {
        localResourceSettingsWebviewPanel = undefined;
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
    case "quickCommandList":
      await event.writeQuickCommandList(params);
      return;
    case "shortcuts":
      await event.writeShortcuts(params);
      return;
    case "manageWorkspace":
      await event.mangeWorkspace();
      await updateWebview();
      return;
  }
}
