import * as core from '@serverless-devs/core';
import { WebviewPanel, ViewColumn, ExtensionContext, Uri } from 'vscode';
import { getWebviewContent, createWebviewPanel } from '../../utils';
import { WEBVIEW_ICON } from '../../constants';

import * as event from './event';
const { lodash: _ } = core;

class LocalResource {
  public static id: string; // webview id 
  public static payload: Record<string, any>;
  public static currentPanel: LocalResource | undefined;
  private readonly _panel: WebviewPanel;

  private constructor(panel: WebviewPanel, private context: ExtensionContext) {
    this._panel = panel;
    this._panel.onDidDispose(
      () => {
        LocalResource.currentPanel = undefined;
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
    const data = await event.getParams(_.get(LocalResource.payload, 'itemData', {}));
    this._panel.webview.html = getWebviewContent(this._panel.webview, this.context.extensionUri, {
      componentName: 'LocalResource',
      ...data,
    });
    return this;
  }
  public static async render(context: ExtensionContext, payload: Record<string, any> = {}) {
    LocalResource.payload = payload;
    const id = _.get(payload, 'itemData.id');
    if (LocalResource.currentPanel && id === LocalResource.id) {
      LocalResource.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = createWebviewPanel('LocalResource', 'Set up - Serverless-Devs');
      panel.iconPath = Uri.parse(WEBVIEW_ICON);
      LocalResource.currentPanel = await new LocalResource(panel, context).run();
      LocalResource.id = id;
    }
  }

  private async receiveMessage(message: any, update: () => Promise<this>) {
    const command = message.command;
    const data = message.data;
    switch (command) {
      case 'updateAlias':
        await event.updateAlias(data);
        break;
      case 'updateShortcuts':
        await event.updateShortcuts(data);
        break;
      case 'updateQuickCommandList':
        await event.updateQuickCommandList(data);
        break;
      case 'executeCommand':
        await event.executeCommand(data);
        break;

      // Add more switch case statements here as more webview message commands
    }
  }
}

export default LocalResource;
