import * as vscode from "vscode";
import * as core from "@serverless-devs/core";
import * as path from "path";
import * as fs from "fs";
import { ext } from "../../extensionVariables";
import { ItemData, TreeItem } from "../../common";
import { TEMPLTE_FILE } from "../../constants";
import { updateYamlSettings } from "../../schema/jsonSchema";

export class LocalResourceTreeDataProvider
  implements vscode.TreeDataProvider<ItemData>
{
  constructor(private extensionContext: vscode.ExtensionContext) {}
  private onDidChange: vscode.EventEmitter<ItemData | undefined> =
    new vscode.EventEmitter<ItemData | undefined>();

  readonly onDidChangeTreeData: vscode.Event<ItemData | undefined> =
    this.onDidChange.event;
  refresh(): void {
    updateYamlSettings(ext.cwd);
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
    const filePath = path.join(ext.cwd, TEMPLTE_FILE);
    if (!fs.existsSync(filePath)) return [];
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const markedYamlList = data["marked-yamls"];
    if (!markedYamlList) return [];
    const itemDataList: ItemData[] = [];
    for (const markedYaml of markedYamlList) {
      const markedFilePath = path.join(ext.cwd, markedYaml.path);
      const yamlData = await core.getYamlContent(markedFilePath);
      if (!yamlData) {
        continue;
      }
      const itemData = new ItemData();
      itemData.label = `${markedYaml.alias}(${markedYaml.path})`;
      itemData.alias = markedYaml.alias;
      itemData.id = `${markedYaml.alias}(${markedYaml.path})`;
      itemData.icon = "box.svg";
      itemData.spath = markedYaml.path;
      itemData.initialCollapsibleState =
        vscode.TreeItemCollapsibleState.Collapsed;
      itemData.command = {
        command: "serverless-devs.goToFile",
        title: "Go to file",
        arguments: [markedFilePath],
      };
      itemData.contextValue = "app";
      const services = yamlData.services;
      for (const service in services) {
        const serviceData = new ItemData();
        serviceData.label = service;
        serviceData.alias = markedYaml.alias;
        serviceData.id = `${markedYaml.alias}(${markedYaml.path}) > ${service}`;
        serviceData.spath = markedYaml.path;
        serviceData.command = {
          command: "serverless-devs.goToFile",
          title: "Go to file",
          arguments: [markedFilePath, service],
        };
        serviceData.icon = "box.svg";
        serviceData.contextValue = "service";
        itemData.children.push(serviceData);
      }
      itemDataList.push(itemData);
    }
    return itemDataList;
  }
}
