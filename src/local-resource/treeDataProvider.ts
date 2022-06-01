import * as vscode from "vscode";
import * as core from "@serverless-devs/core";
import * as path from "path";
import * as fs from "fs";
import { ext } from "../extensionVariables";
import { ItemData, TreeItem } from "../common";

export class LocalResourceTreeDataProvider
  implements vscode.TreeDataProvider<ItemData>
{
  constructor(private extensionContext: vscode.ExtensionContext) {}
  private onDidChange: vscode.EventEmitter<ItemData | undefined> =
    new vscode.EventEmitter<ItemData | undefined>();

  readonly onDidChangeTreeData: vscode.Event<ItemData | undefined> =
    this.onDidChange.event;
  refresh(): void {
    this.onDidChange.fire(undefined);
  }

  getTreeItem(p: ItemData): TreeItem {
    let treeItem: TreeItem;
    if (p.children.length) {
      treeItem = new TreeItem(
        p,
        p.initialCollapsibleState,
        this.extensionContext
      );
    } else {
      treeItem = new TreeItem(
        p,
        vscode.TreeItemCollapsibleState.None,
        this.extensionContext
      );
    }
    return treeItem;
  }

  async getChildren(element: ItemData): Promise<ItemData[]> {
    let itemDataList: ItemData[] = [];
    if (element) {
      itemDataList = element.children;
    } else {
      itemDataList = await this.transformYamlData();
    }
    return itemDataList;
  }

  async transformYamlData() {
    const filePath = path.join(ext.cwd, ".serverless-devs");
    if (!fs.existsSync(filePath)) return [];
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const markedYamlList = data["vscode-marked-yamls"];
    if (!markedYamlList) return [];
    const itemDataList: ItemData[] = [];
    for (const markedYaml of markedYamlList) {
      const fileName = path.basename(markedYaml.path);
      const itemData = new ItemData();
      itemData.label = `${markedYaml.alias}(${fileName})`;
      itemData.id = fileName;
      itemData.icon = "box.svg";
      itemData.scommand = "s deploy";
      itemData.initialCollapsibleState =
        vscode.TreeItemCollapsibleState.Collapsed;
      const yamlData = await core.getYamlContent(markedYaml.path);
      const services = yamlData.services;
      for (const service in services) {
        const serviceData = new ItemData();
        serviceData.label = service;
        serviceData.id = `${fileName}-${service}`;
        serviceData.scommand = `s ${service} deploy`;
        (serviceData.command = {
          command: "serverless-devs.goToFile",
          title: "Go to file",
          arguments: [markedYaml.path],
        }),
          (serviceData.icon = "box.svg");
        itemData.children.push(serviceData);
      }
      itemDataList.push(itemData);
    }
    return itemDataList;
  }
}
