import * as vscode from "vscode";
import { getHtmlForWebview } from "../../common";
import * as event from "./event";
import * as core from "@serverless-devs/core";
import { ItemData } from "../../common";
import { ext } from "../../extensionVariables";
import { getComponentInfo } from "../../services";
const { lodash: _ } = core;

let localResourceSettingsWebviewPanel: vscode.WebviewPanel | undefined;
export async function activeLocalResourceSettingsWebview(
  context: vscode.ExtensionContext,
  itemData: ItemData
) {
  if (localResourceSettingsWebviewPanel) {
    localResourceSettingsWebviewPanel.reveal();
    await new UpdateWebview(context, itemData).init();
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
    await new UpdateWebview(context, itemData).init();
    localResourceSettingsWebviewPanel.iconPath = vscode.Uri.parse(
      "https://img.alicdn.com/imgextra/i4/O1CN01AvqMOu1sYpY1j8xaI_!!6000000005779-2-tps-574-204.png"
    );
    localResourceSettingsWebviewPanel.webview.onDidReceiveMessage(
      handleMessage,
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

class UpdateWebview {
  constructor(
    private context: vscode.ExtensionContext,
    private itemData: ItemData
  ) {
    localResourceSettingsWebviewPanel.webview.html = getHtmlForWebview(
      "local-resource/settings",
      this.context,
      localResourceSettingsWebviewPanel.webview,
      {
        $loading: true,
      }
    );
  }
  async init() {
    let quickCommandList = [];
    if (this.itemData.contextValue === "app") {
      quickCommandList = await this.updateWithApp();
    } else {
      quickCommandList = await this.updateWithService();
    }
    console.log(quickCommandList);

    localResourceSettingsWebviewPanel.webview.html = getHtmlForWebview(
      "local-resource/settings",
      this.context,
      localResourceSettingsWebviewPanel.webview,
      {
        quickCommandList,
        itemData: this.itemData,
      }
    );
  }
  async updateWithApp() {
    const yamlData = await core.getYamlContent(this.itemData.spath);
    const services = _.get(yamlData, "services", {});
    // 寻找所有组件的命令
    const commandList = [];
    for (const service in services) {
      const ele = services[service];
      const response = await getComponentInfo(ele.component);
      const commands = _.get(response, "commands", {});
      const currentCommand = [];
      for (const command in commands) {
        const ele = commands[command];
        if (_.isPlainObject(ele)) {
          for (const key in ele) {
            currentCommand.push({ command: key, desc: ele[key] });
          }
        } else {
          currentCommand.push({ command, desc: ele });
        }
      }
      commandList.push(currentCommand);
    }
    // // 寻找最少命令的组件
    let minCommand = commandList[0];
    for (const commandItem of commandList) {
      if (commandItem.length < minCommand.length) {
        minCommand = commandItem;
      }
    }
    const commonCommand = [];
    // 寻找组件共同的命令
    for (const item of minCommand) {
      const needs = [];
      for (const commandItem of commandList) {
        const findObj = _.find(
          commandItem,
          (obj) => obj.command === item.command
        );
        if (findObj) {
          needs.push(true);
        }
      }
      if (needs.length === commandList.length) {
        item.id = _.uniqueId();
        item.args = "";
        commonCommand.push(item);
      }
    }
    return commonCommand;
  }
  async updateWithService() {
    return [];
  }
}

async function handleMessage(params: { type: string; [key: string]: any }) {
  switch (params.type) {
    case "quickCommandList":
      await event.writeQuickCommandList(params);
      return;
    case "shortcuts":
      await event.writeShortcuts(params);
      return;
  }
}
