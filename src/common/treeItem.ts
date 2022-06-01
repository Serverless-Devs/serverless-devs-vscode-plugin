import * as vscode from "vscode";

export class ItemData {
  label = "";

  id = "";

  description = "";

  tooltip = "";

  scommand = "";

  command;

  contextValue = "";

  icon = "";

  children: ItemData[] = [];

  initialCollapsibleState: vscode.TreeItemCollapsibleState =
    vscode.TreeItemCollapsibleState.None;
}

export class TreeItem extends vscode.TreeItem {
  iconPath: { light: vscode.Uri; dark: vscode.Uri };
  contextValue = "treeItem";
  constructor(
    itemData: ItemData,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly extensionContext: vscode.ExtensionContext
  ) {
    super(itemData.label, collapsibleState);

    if (itemData.description) {
      this.description = itemData.description;
    }

    if (itemData.tooltip) {
      this.tooltip = itemData.tooltip;
    }

    if (itemData.command) {
      this.command = itemData.command;
    }

    if (itemData.id) {
      this.id = itemData.id;
    }

    const { light, dark } = this.getTreeItemIcon(itemData);
    if (light && dark) {
      this.iconPath = { light, dark };
    } else {
      delete this.iconPath;
    }

    this.contextValue = this.getTreeItemContextValue(itemData);
  }

  private getTreeItemIcon(itemData: ItemData) {
    const iconName = itemData.icon;
    const light = iconName
      ? vscode.Uri.file(
          this.extensionContext.asAbsolutePath(`media/light/${iconName}`)
        )
      : null;
    const dark = iconName
      ? vscode.Uri.file(
          this.extensionContext.asAbsolutePath(`media/dark/${iconName}`)
        )
      : null;
    return { light, dark };
  }

  private getTreeItemContextValue(itemData: ItemData): string {
    if (itemData.contextValue) {
      return itemData.contextValue;
    }
    if (itemData.children.length) {
      return "parent";
    }
    return "child";
  }
}
