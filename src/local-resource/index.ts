import * as vscode from "vscode";
import * as path from "path";
import { ext } from "../extensionVariables";
import { LocalResourceTreeDataProvider } from "./treeDataProvider";
import { autoMark } from "./autoMark";

export class LocalResource {
  constructor(context: vscode.ExtensionContext) {
    ext.localResource = new LocalResourceTreeDataProvider(context);
    const view = vscode.window.createTreeView("local-resource", {
      treeDataProvider: ext.localResource,
      showCollapseAll: false,
    });
    context.subscriptions.push(view);
    view.title = `${path.basename(ext.cwd)}(Serverless-Devs)`;
    this.registerRefreshCommand();
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
