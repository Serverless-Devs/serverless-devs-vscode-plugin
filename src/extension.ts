// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ext } from "./extensionVariables";
import { DevsTree } from "./local-resource";
import { init } from "./commands/init";
import { config } from "./commands/config";
import { deploy } from "./commands/deploy";
import { testWebview } from "./local-resource/testWebview";
import { statusBarItem } from "./status/statusBarItem";
import { activeGlobalSettingsWebview } from "./global-settings";

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
    vscode.commands.registerCommand("serverless-devs.deploy", () => deploy())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.set", async () => {
      await activeGlobalSettingsWebview(context);
    })
  );

  new DevsTree(context);

  testWebview(context);
  statusBarItem(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
