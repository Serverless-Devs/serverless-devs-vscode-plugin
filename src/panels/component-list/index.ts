import * as core from '@serverless-devs/core';
import { WebviewPanel, ViewColumn, ExtensionContext, Uri } from 'vscode';
import { getWebviewContent, createWebviewPanel } from '../../utils';
import { WEBVIEW_ICON } from '../../constants';
import * as event from './event';
const { lodash: _ } = core;

class ComponentList {
  public static currentPanel: ComponentList | undefined;
  private readonly _panel: WebviewPanel;

  private constructor(panel: WebviewPanel, private context: ExtensionContext) {
    this._panel = panel;
    this._panel.onDidDispose(
      () => {
        ComponentList.currentPanel = undefined;
      },
      null,
      context.subscriptions,
    );
    this._panel.webview.onDidReceiveMessage(
      (message) => this.receiveMessage(message, () => this.run()),
      undefined,
      context.subscriptions,
    );
  }

  async run() {
    this._panel.webview.html = getWebviewContent(this._panel.webview, this.context.extensionUri, {
      componentName: 'ComponentList',
      componentList: await event.getComponentList(),
    });
    return this;
  }
  public static async render(context: ExtensionContext) {
    if (ComponentList.currentPanel) {
      ComponentList.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = createWebviewPanel('ComponentList', '密钥管理');
      panel.iconPath = Uri.parse(WEBVIEW_ICON);
      ComponentList.currentPanel = await new ComponentList(panel, context).run();
    }
  }

  private async receiveMessage(message: any, update: () => Promise<this>) {
    const command = message.command;
    const data = message.data;
    switch (command) {
      case 'deleteComponent':
        await event.deleteComponent(data);
        await update();
        break;
      // Add more switch case statements here as more webview message commands
    }
  }
}

export default ComponentList;
