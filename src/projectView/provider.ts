import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as core from "@serverless-devs/core";

import { ProjectTreeItem } from "./item";
import { AbstractTreeProvider } from "../lib/abstractTreeProvider";
import { ProviderResult } from "vscode";

export class ProjectTreeProvider extends AbstractTreeProvider<ProjectTreeItem> {
  constructor(private workspaceRoot: string) {
    super();
  }

  getParent(element: ProjectTreeItem): ProviderResult<ProjectTreeItem> {
    throw new Error("Method not implemented.");
  }

  async getChildren(element?: ProjectTreeItem): Promise<ProjectTreeItem[]> {
    const accessPath = path.join(core.getRootHome(), "access.yaml");
    const accessData = await core.getYamlContent(accessPath);
    if (!accessData || 1) {
      return Promise.resolve([
        new ProjectTreeItem(
          "Add Account",
          "",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "serverless-devs.config",
            title: "Add Account",
          }
        ),
      ]);
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
