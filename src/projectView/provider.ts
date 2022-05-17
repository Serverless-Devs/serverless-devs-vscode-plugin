import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import core from '@serverless-devs/core';

import { ProjectTreeItem } from './item';
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
		const template = path.join(this.workspaceRoot, 's.yaml');
		if (this.pathExists(template)) {
			// s config get 为空
			if(true) {
				return Promise.resolve([
					new ProjectTreeItem('Please Add Account', '', vscode.TreeItemCollapsibleState.None, {
						command: 'serverless-devs.config',
						title: '',
						arguments: ['aaa']
					})
				]);
			}
			// return Promise.resolve(this.getDepsInPackageJson(template));
		} else {
			vscode.window.showInformationMessage('Workspace has no s.yaml');
			return Promise.resolve([]);
		}
  }

  /**
	 * Given the path to s.yaml, read all its dependencies and devDependencies.
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