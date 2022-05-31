import * as vscode from "vscode";
import * as core from "@serverless-devs/core";
import * as path from "path";
import * as fs from "fs";
import { ext } from "../extensionVariables";
import { ItemData, TreeItem } from "./TreeItem";

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
    const dir = fs.readdirSync(ext.cwd);
    const itemDataList: ItemData[] = [];
    for (const fileName of dir) {
      const extname = path.extname(fileName);
      if ([".yaml", ".yml"].includes(extname)) {
        const filePath = path.join(ext.cwd, fileName);
        const yamlData = await core.getYamlContent(filePath);
        if (yamlData.alias) {
          const itemData = new ItemData();
          itemData.label = `${yamlData.alias}(${fileName})`;
          itemData.id = fileName;
          itemData.icon = "box.svg";
          itemData.command = "s deploy";
          itemData.initialCollapsibleState =
            vscode.TreeItemCollapsibleState.Collapsed;
          const services = yamlData.services;
          for (const service in services) {
            const serviceData = new ItemData();
            serviceData.label = service;
            serviceData.id = `${fileName}-${service}`;
            serviceData.command = `s ${service} deploy`;
            serviceData.icon = "box.svg";
            itemData.children.push(serviceData);
          }
          itemDataList.push(itemData);
        }
      }
    }
    return itemDataList;
  }
}
