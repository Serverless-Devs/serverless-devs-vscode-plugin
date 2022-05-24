import * as vscode from "vscode";
import * as path from "path";

export class LocalTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private readonly desc: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    this.tooltip = this.desc ? `${this.label}-${this.desc}` : this.label;
    this.description = this.desc;
    this.iconPath = {
      light: path.resolve(__dirname, "..", "..", "media", "light", "box.svg"),
      dark: path.resolve(__dirname, "..", "..", "media", "dark", "box.svg"),
    };
  }

  contextValue = "local";
}
