import * as vscode from "vscode";
import * as path from "path";
import * as core from "@serverless-devs/core";
import { LocalTreeItem } from "./item";
import { AbstractTreeProvider } from "../common";
import { getYaml } from "../utils";
import { ProviderResult } from "vscode";

export class LocalResource extends AbstractTreeProvider<LocalTreeItem> {
  constructor() {
    super();
  }

  getParent(element: LocalTreeItem): ProviderResult<LocalTreeItem> {
    throw new Error("Method not implemented.");
  }

  async getChildren(element?: LocalTreeItem): Promise<LocalTreeItem[]> {
    const accessPath = path.join(core.getRootHome(), "access.yaml");
    const accessData = await core.getYamlContent(accessPath);
    if (accessData) {
      const yamlData = await getYaml();
      if (yamlData) {
        const result = [];
        const { services } = yamlData;
        for (const key in services) {
          result.push(
            new LocalTreeItem(key, "", vscode.TreeItemCollapsibleState.None)
          );
        }
        return Promise.resolve(result);
      }
    }
  }
}
