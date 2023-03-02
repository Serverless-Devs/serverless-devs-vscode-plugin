import { WebviewPanel, window, ViewColumn, ExtensionContext, Uri } from 'vscode';
import { getWebviewContent, createWebviewPanel } from '../utils';
import { WEBVIEW_ICON } from '../constants';

const COPMONENT_NAME = 'GlobalSettings';

export class GlobalSettings {
  public static currentPanel: GlobalSettings | undefined;
  private readonly _panel: WebviewPanel;

  private constructor(panel: WebviewPanel, context: ExtensionContext) {
    this._panel = panel;
    this._panel.onDidDispose(
      () => {
        GlobalSettings.currentPanel = undefined;
      },
      null,
      context.subscriptions,
    );
    this._panel.webview.html = getWebviewContent(
      this._panel.webview,
      context.extensionUri,
      COPMONENT_NAME,
    );
    this._panel.webview.onDidReceiveMessage(this.receiveMessage, undefined, context.subscriptions);
  }

  public static render(context: ExtensionContext) {
    if (GlobalSettings.currentPanel) {
      GlobalSettings.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = createWebviewPanel('GlobalSettings', '设置中心');
      panel.iconPath = Uri.parse(WEBVIEW_ICON);
      GlobalSettings.currentPanel = new GlobalSettings(panel, context);
    }
  }

  private receiveMessage(message: any) {
    const command = message.command;
    const text = message.text;

    switch (command) {
      case 'hello':
        window.showInformationMessage(text);
        return;
      // Add more switch case statements here as more webview message commands
    }
  }
}
