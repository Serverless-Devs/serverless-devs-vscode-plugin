import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { NxProject, ProjectTreeItem } from './item';
import {AbstractTreeProvider} from '../lib/abstractTreeProvider';
import { ProviderResult } from 'vscode';

export class ProjectTreeProvider extends AbstractTreeProvider<ProjectTreeItem> {
  constructor(private workspaceRoot: string) {
    super();
  }

  getParent(element: ProjectTreeItem): ProviderResult<ProjectTreeItem> {
    throw new Error('Method not implemented.');
  }
  
  getChildren(element?: ProjectTreeItem): ProviderResult<ProjectTreeItem[]> {
    if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No ProjectTreeItem in empty workspace');
			return Promise.resolve([]);
		}

		if (element) {
			return Promise.resolve(this.getDepsInPackageJson(path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')));
		} else {
			const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
			if (this.pathExists(packageJsonPath)) {
				return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
			} else {
				vscode.window.showInformationMessage('Workspace has no package.json');
				return Promise.resolve([]);
			}
		}
  }

  /**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
	private getDepsInPackageJson(packageJsonPath: string): ProjectTreeItem[] {
		return [].concat(new ProjectTreeItem('dankun', '0.0.1', vscode.TreeItemCollapsibleState.None, {
			command: 'extension.openPackageOnNpm',
			title: '',
			arguments: ['dankun']
		}));
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