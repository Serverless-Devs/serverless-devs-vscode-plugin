import * as vscode from "vscode";
import * as path from "path";
import * as commandExists from 'command-exists';
import { ext } from "../../extensionVariables";
import { LocalResourceTreeDataProvider } from "./treeDataProvider";
import { autoMark } from "./autoMark";

export class LocalResource {
  constructor(context: vscode.ExtensionContext) {
    const existsSTool = commandExists.sync('s');
    if (existsSTool) {
      ext.localResource = new LocalResourceTreeDataProvider(context);
      const view = vscode.window.createTreeView("local-resource", {
        treeDataProvider: ext.localResource,
        showCollapseAll: true,
      });
      context.subscriptions.push(view);
      view.title = `${path.basename(ext.cwd)}(Serverless-Devs)`;
      this.registerRefreshCommand();
    }
  }
  async autoMark() {
    await autoMark(ext.cwd);
  }
  registerRefreshCommand() {
    vscode.commands.registerCommand("serverless-devs.refresh", () => {
      ext.localResource.refresh();
    });
  }
}
