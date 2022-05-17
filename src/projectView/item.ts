import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import * as vscode from 'vscode';
import * as path from 'path';

export class ProjectTreeItem extends TreeItem {
  constructor(
		public readonly label: string,
		private readonly desc: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		this.tooltip = `${this.label}-${this.desc}`;
		this.description = this.desc;
		this.iconPath = desc ? {
			light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'dependency.svg'),
			dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'dependency.svg')
		} : null;
	}
}

export interface Project {
  project: string;
  root: string;
  target?: {
    name: string;
    configuration?: string;
  };
}
