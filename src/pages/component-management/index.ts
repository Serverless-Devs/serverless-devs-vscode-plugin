import * as vscode from 'vscode';
import * as core from '@serverless-devs/core';
import { setPanelIcon, updateWebview } from '../../common';
import { deleteComponent, getComponentWithAll } from '../../common/component';

let componentWebviewPanel: vscode.WebviewPanel | undefined;

export async function activeComponentWebviewPanel(
  context: vscode.ExtensionContext
) {
  if (componentWebviewPanel) {
    componentWebviewPanel.reveal();
  } else {
    componentWebviewPanel = vscode.window.createWebviewPanel(
      "Serverless-Devs",
      "通过模板进行应用创建 - Serverless-Devs",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );
    const componentAll = await getComponentWithAll();
    await updateWebview(componentWebviewPanel, 'component-management', context, {
      componentAll
    });

    await setPanelIcon(componentWebviewPanel);
    componentWebviewPanel.onDidDispose(
      () => {
        componentWebviewPanel = undefined;
      },
      null,
      context.subscriptions
    );

    componentWebviewPanel.webview.onDidReceiveMessage(
      (message) => {
        handleMessage(message, context);
      },
      undefined,
      context.subscriptions
    );
  }
}

async function handleMessage(message: any, context: vscode.ExtensionContext) {
  if (message.command === 'deleteComponent') {
    try {
      const res = await vscode.window.showInformationMessage(
        `Are you sure to delete 
          ${message.component
          ? message.component
          : 'All'}
         component?`, 'yes', 'no');
      if (res === 'yes') {
        if (message.component) {
          await deleteComponent(message.component);
        } else {
          await deleteComponent();
        }
        vscode.window.showInformationMessage(`
        Delete ${message.component
            ? message.component
            : 'All'} component successful`);
        const componentAll = await getComponentWithAll();
        await updateWebview(componentWebviewPanel, 'component-management', context, {
          componentAll
        });
      }
    } catch (e) {
      vscode.window.showErrorMessage(
        `Delete ${message.component} failed.${e.message}`);
    }
  }
}
