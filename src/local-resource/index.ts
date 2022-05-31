import * as vscode from "vscode";
import * as path from "path";
import { ext } from "../extensionVariables";
import { ItemData, TreeItem } from "./TreeItem";

export class LocalResource {
  constructor(context: vscode.ExtensionContext) {
    const view = vscode.window.createTreeView("local-resource", {
      treeDataProvider: new LocalResourceTreeDataProvider(context),
      showCollapseAll: false,
    });
    context.subscriptions.push(view);
    view.title = `${path.basename(ext.cwd)}(Serverless Devs)`;
  }
}
const yamlData = [
  {
    alias: "开发环境",
    services: [
      {
        label: "a1",
      },
      {
        label: "a2",
      },
      {
        label: "a3",
      },
    ],
  },
  {
    alias: "生产环境",
    services: [
      {
        label: "b1",
      },
      {
        label: "b2",
      },
      {
        label: "b3",
      },
    ],
  },
];

class LocalResourceTreeDataProvider
  implements vscode.TreeDataProvider<ItemData>
{
  constructor(private extensionContext: vscode.ExtensionContext) {}
  private _onDidChangeTreeData: vscode.EventEmitter<ItemData | undefined> =
    new vscode.EventEmitter<ItemData | undefined>();
  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
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
      itemDataList = this.transformYamlData(yamlData);
    }
    return itemDataList;
  }

  transformYamlData(yamlData: any) {
    const itemDataList: ItemData[] = [];
    yamlData.forEach((item) => {
      const itemData = new ItemData();
      itemData.label = item.alias;
      itemData.id = item.alias;
      itemData.icon = "box.svg";
      itemData.initialCollapsibleState =
        vscode.TreeItemCollapsibleState.Collapsed;
      itemData.children = item.services.map((service) => {
        const serviceData = new ItemData();
        serviceData.label = service.label;
        serviceData.id = service.label;
        serviceData.icon = "box.svg";
        return serviceData;
      });
      itemDataList.push(itemData);
    });
    return itemDataList;
  }
}
