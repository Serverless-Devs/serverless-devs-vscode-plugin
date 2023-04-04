import * as core from '@serverless-devs/core';
import * as os from 'os';
import { WebviewPanel, ViewColumn, ExtensionContext, Uri } from 'vscode';
import { getWebviewContent, createWebviewPanel } from '../../utils';
import { WEBVIEW_ICON } from '../../constants';
import { CreateAppType } from '../../interface';
import * as event from './event';
const { lodash: _ } = core;

class CreateApp {
  public static id: string; // webview id 
  public static payload: Record<string, any>;
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
      downloadPath: os.homedir(),
      aliasList: await core.getCredentialAliasList(),
      ...CreateApp.payload,
    });
    return this;
  }
  public static async render(context: ExtensionContext, payload: Record<string, any> = {}) {
    CreateApp.payload = payload;
    const id = _.get(payload, 'type', CreateAppType.registry);
    if (CreateApp.currentPanel && id === CreateApp.id) {
      CreateApp.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = createWebviewPanel('CreateApp', '创建应用');
      panel.iconPath = Uri.parse(WEBVIEW_ICON);
      CreateApp.currentPanel = await new CreateApp(panel, context).run();
      CreateApp.id = id;
    }
  }

  private async receiveMessage(message: any, update: () => Promise<this>) {
    const command = message.command;
    const data = message.data;
    switch (command) {
      case 'setDownloadPath':
        await event.setDownloadPath(data, this._panel.webview);
        break;
      case 'createApp':
        await event.createApp(data, this._panel);
      // Add more switch case statements here as more webview message commands
    }
  }
}

export default CreateApp;
