import { WebviewPanel, window, ViewColumn, ExtensionContext } from 'vscode';
import { getWebviewContent, createWebviewPanel } from '../utils';

const COPMONENT_NAME = 'HelloWorld';

export class HelloWorldPanel {
  public static currentPanel: HelloWorldPanel | undefined;
  private readonly _panel: WebviewPanel;

  private constructor(panel: WebviewPanel, context: ExtensionContext) {
    this._panel = panel;
    this._panel.onDidDispose(
      () => {
        HelloWorldPanel.currentPanel = undefined;
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
    if (HelloWorldPanel.currentPanel) {
      HelloWorldPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = createWebviewPanel('showHelloWorld', 'Hello World');
      HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, context);
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
