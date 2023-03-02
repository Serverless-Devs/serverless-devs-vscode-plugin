import * as core from '@serverless-devs/core';
import * as open from 'open';
import { WebviewPanel, ViewColumn, ExtensionContext, Uri } from 'vscode';
import { getWebviewContent, createWebviewPanel } from '../../utils';
import { WEBVIEW_ICON, ISSUE_URL } from '../../constants';
import * as event from './event';

export class GlobalSettings {
  public static currentPanel: GlobalSettings | undefined;
  private readonly _panel: WebviewPanel;

  private constructor(panel: WebviewPanel, private context: ExtensionContext) {
    this._panel = panel;
    this._panel.onDidDispose(
      () => {
        GlobalSettings.currentPanel = undefined;
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
    const analysis = await core.getSetConfig('analysis');
    this._panel.webview.html = getWebviewContent(this._panel.webview, this.context.extensionUri, {
      componentName: 'GlobalSettings',
      analysis: analysis === 'enable',
      workspace: core.getRootHome(),
    });
    return this;
  }
  public static async render(context: ExtensionContext) {
    if (GlobalSettings.currentPanel) {
      GlobalSettings.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = createWebviewPanel('GlobalSettings', '设置中心');
      panel.iconPath = Uri.parse(WEBVIEW_ICON);
      GlobalSettings.currentPanel = await new GlobalSettings(panel, context).run();
    }
  }

  private async receiveMessage(message: any, update: () => Promise<this>) {
    const command = message.command;
    const data = message.data;
    switch (command) {
      case 'resetWorkspace':
        await event.resetWorkspace();
        await update();
        break;
      case 'manageWorkspace':
        await event.mangeWorkspace();
        await update();
        break;
      case 'setAnalysis':
        await event.setAnalysis(data);
        break;
      case 'issueFeedback':
        open(ISSUE_URL);
        break;
      // Add more switch case statements here as more webview message commands
    }
  }
}
