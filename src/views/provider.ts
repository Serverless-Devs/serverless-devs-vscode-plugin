import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as core from "@serverless-devs/core";

import { ProjectTreeItem } from "./item";
import { AbstractTreeProvider } from "../lib/abstractTreeProvider";
import { getYaml } from "../lib/utils";
import { ProviderResult } from "vscode";

export class ProjectTreeProvider extends AbstractTreeProvider<ProjectTreeItem> {
  constructor() {
    super();
  }

  getParent(element: ProjectTreeItem): ProviderResult<ProjectTreeItem> {
    throw new Error("Method not implemented.");
  }

  async getChildren(element?: ProjectTreeItem): Promise<ProjectTreeItem[]> {
    const accessPath = path.join(core.getRootHome(), "access.yaml");
    const accessData = await core.getYamlContent(accessPath);
    if (accessData) {
      const yamlData = await getYaml();
      if (yamlData) {
        const result = [];
        const { services } = yamlData;
        for (const key in services) {
          result.push(
            new ProjectTreeItem(key, "", vscode.TreeItemCollapsibleState.None)
          );
        }
        return Promise.resolve(result);
      }
    }
  }

  /**
   * Given the path to s.yaml, read all its dependencies and devDependencies.
   */
  private getDepsInPackageJson(packageJsonPath: string): ProjectTreeItem[] {
    return [].concat(
      new ProjectTreeItem(
        "dankun",
        "0.0.1",
        vscode.TreeItemCollapsibleState.None,
        {
          command: "extension.openPackageOnNpm",
          title: "",
          arguments: ["dankun"],
        }
      )
    );
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }

    return true;
  }
}
