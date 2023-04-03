import * as core from '@serverless-devs/core';
import * as path from 'path';
import * as open from 'open';
import { WebviewPanel, ViewColumn, ExtensionContext, Uri } from 'vscode';
import { getWebviewContent, createWebviewPanel } from '../../utils';
import { WEBVIEW_ICON } from '../../constants';
import * as event from './event';
const { lodash: _ } = core;

class CredentialList {
  public static currentPanel: CredentialList | undefined;
  private readonly _panel: WebviewPanel;

  private constructor(panel: WebviewPanel, private context: ExtensionContext) {
    this._panel = panel;
    this._panel.onDidDispose(
      () => {
        CredentialList.currentPanel = undefined;
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

  async getCredentialList() {
    const data = await core.getYamlContent(path.join(core.getRootHome(), 'access.yaml'));
    if (_.isEmpty(data)) return [];
    const list: any = [];
    for (const access in data) {
      const info = await core.getCredential(access);
      list.push(info);
    }
    return list;
  }

  async run() {
    this._panel.webview.html = getWebviewContent(this._panel.webview, this.context.extensionUri, {
      componentName: 'CredentialList',
      credentialList: await this.getCredentialList(),
    });
    return this;
  }
  public static async render(context: ExtensionContext) {
    if (CredentialList.currentPanel) {
      CredentialList.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = createWebviewPanel('CredentialList', '密钥管理');
      panel.iconPath = Uri.parse(WEBVIEW_ICON);
      CredentialList.currentPanel = await new CredentialList(panel, context).run();
    }
  }

  private async receiveMessage(message: any, update: () => Promise<this>) {
    const command = message.command;
    const data = message.data;
    switch (command) {
      case 'deleteCredential':
        await event.deleteCredential(data);
        await update();
        break;
      case 'addCredential':
        const { success } = await event.addCredential(data);
        success && (await update());
        break;
      case 'openAccessUrl':
        await open(data.doc);
      // Add more switch case statements here as more webview message commands
    }
  }
}

export default CredentialList;
