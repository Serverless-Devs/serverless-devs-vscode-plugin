// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ext } from "./extensionVariables";
import { LocalResource } from "./local-resource";
import { init } from "./commands/init";
import { config } from "./commands/config";
import { deploy } from "./commands/deploy";
import { markYaml } from "./commands/mark-yaml";
import { goToFile } from "./commands/go-to-file";
import { statusBarItem } from "./status/statusBarItem";
import { activeGlobalSettingsWebview } from "./global-settings";
import { activeLocalResourceSettingsWebview } from "./local-resource/settings";

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
  // s deploy
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.deploy", (itemData) =>
      deploy(itemData)
    )
  );
  // 标记Yaml文件到工作空间
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "serverless-devs.yaml",
      (uri: vscode.Uri) => {
        markYaml(uri);
      }
    )
  );
  // 设置中心
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.set", () => {
      activeGlobalSettingsWebview(context);
    })
  );
  // 打开文件
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "serverless-devs.goToFile",
      (filePath: string, flowName: string) => {
        goToFile(filePath, flowName);
      }
    )
  );

  // local resource set
  context.subscriptions.push(
    vscode.commands.registerCommand("local-resource.set", (itemData) => {
      activeLocalResourceSettingsWebview(context, itemData);
    })
  );

  new LocalResource(context);
  statusBarItem(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
