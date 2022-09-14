// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import { ext } from "./extensionVariables";
import { LocalResource } from "./pages/local-resource";
import { init } from "./commands/init";
import { custom } from "./commands/custom";
import { markYaml } from "./commands/mark-yaml";
import { goToFile } from "./commands/go-to-file";
import { activeGlobalSettingsWebview } from "./pages/global-settings";
import { activeLocalResourceSettingsWebview } from "./pages/local-resource/settings";
import { createTerminal } from "./common";
import * as open from "open";
import { activeCredentialWebviewPanel } from "./pages/credential-management";
import { activeApplicationWebviewPanel } from "./pages/registry";
import { pickCreateMethod } from "./common/createApp";
import { installSTool } from "./common/installSTool";
import { activeComponentWebviewPanel } from "./pages/component-management";
import { closeSYaml } from "./common/closeSYaml";

export async function activate(context: vscode.ExtensionContext) {
  ext.context = context;
  ext.cwd =
    vscode.workspace.workspaceFolders &&
      vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;
  // s init 
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.init", () => init(context))
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('create.pick', () => pickCreateMethod(context))
  );
  // s verify
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.verify", (itemData) => {
      const template = path.relative(ext.cwd, itemData.fsPath);
      createTerminal(`s verify -t ${template}`);
    })
  );
  // s edit
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.edit", (itemData) => {
      const template = path.relative(ext.cwd, itemData.fsPath);
      createTerminal(`s edit -t ${template}`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.home", () => {
      open("https://www.serverless-devs.com");
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.registry", () => {
      open("http://www.devsapp.cn/index.html");
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.github", () => {
      open("https://github.com/Serverless-Devs/Serverless-Devs");
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.group", () => {
      open("http://i.serverless-devs.com");
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.issue", () => {
      open("https://github.com/Serverless-Devs/Serverless-Devs/issues");
    })
  );
  // s config add,get and delete
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.config", () => {
      activeCredentialWebviewPanel(context);
    })
  );

  // 通过registry应用中心创建
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.app", () => {
      activeApplicationWebviewPanel(context);
    })
  );

  // 添加yaml配置到工作空间
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "serverless-devs.yaml",
      (uri: vscode.Uri) => {
        markYaml(uri);
      }
    )
  );

  // 组件管理
  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.component", () => {
      activeComponentWebviewPanel(context);
    })
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

  // local resource deploy
  context.subscriptions.push(
    vscode.commands.registerCommand("local-resource.deploy", (itemData) => {
      itemData.scommand = "deploy";
      custom(itemData);
    })
  );

  // local resource build
  context.subscriptions.push(
    vscode.commands.registerCommand("local-resource.build", (itemData) => {
      itemData.scommand = "build";
      custom(itemData);
    })
  );

  // local resource invoke
  context.subscriptions.push(
    vscode.commands.registerCommand("local-resource.invoke", (itemData) => {
      itemData.scommand = "invoke";
      custom(itemData);
    })
  );

  // local resource set
  context.subscriptions.push(
    vscode.commands.registerCommand("local-resource.set", (itemData) => {
      activeLocalResourceSettingsWebview(context, itemData);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("serverless-devs.install", () => {
      installSTool();
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument(document => {
      closeSYaml(document);
    })
  );

  await new LocalResource(context).autoMark();
}

// this method is called when your extension is deactivated
export function deactivate() { }
