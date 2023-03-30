import * as core from '@serverless-devs/core';
import { WebviewPanel, ViewColumn, ExtensionContext, Uri } from 'vscode';
import { getWebviewContent, createWebviewPanel } from '../../utils';
import { WEBVIEW_ICON } from '../../constants';
import * as event from './event';
const { lodash: _ } = core;

class CreateApp {
  public static currentPanel: CreateApp | undefined;
  private readonly _panel: WebviewPanel;

  private constructor(panel: WebviewPanel, private context: ExtensionContext) {
    this._panel = panel;
    this._panel.onDidDispose(
      () => {
        CreateApp.currentPanel = undefined;
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
      componentName: 'CreateApp',
    });
    return this;
  }
  public static async render(context: ExtensionContext) {
    if (CreateApp.currentPanel) {
      CreateApp.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = createWebviewPanel('CreateApp', '创建应用');
      panel.iconPath = Uri.parse(WEBVIEW_ICON);
      CreateApp.currentPanel = await new CreateApp(panel, context).run();
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

export default CreateApp;
