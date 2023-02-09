import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from 'vscode';
import { getWebviewContent, createWebviewPanel } from '../utils';

const COPMONENT_NAME = 'HelloWorld';

export class HelloWorldPanel {
  public static currentPanel: HelloWorldPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;
    this._panel.onDidDispose(this.dispose, null, this._disposables);
    this._panel.webview.html = getWebviewContent(this._panel.webview, extensionUri, COPMONENT_NAME);
    this._setWebviewMessageListener(this._panel.webview);
  }

  public static render(extensionUri: Uri) {
    if (HelloWorldPanel.currentPanel) {
      HelloWorldPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = createWebviewPanel('showHelloWorld', 'Hello World');
      HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
    }
  }

  public dispose() {
    HelloWorldPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        const text = message.text;

        switch (command) {
          case 'hello':
            window.showInformationMessage(text);
            return;
          // Add more switch case statements here as more webview message commands
        }
      },
      undefined,
      this._disposables,
    );
  }
}
