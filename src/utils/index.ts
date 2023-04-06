import * as path from 'path';
import { ext } from '../extensionVariables';
import * as core from '@serverless-devs/core';
import * as vscode from 'vscode';

export const getLanguage = () => {
  const language = vscode.env.language;
  // 简体
  if (language === 'zh-cn') return 'zh';
  // 繁体
  if (language === 'zh-tw') return 'zh';
  return 'en';
}


export function getUri(webview: vscode.Webview, extensionUri: vscode.Uri, pathList: string[]) {
  return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}

export function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function getWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  config: Record<string, any> = {},
) {
  const { componentName, ...rest } = config;
  // const theme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
  const theme = 'light';
  // const theme = 'dark';
  // The CSS file from the React build output
  const stylesUri = getUri(webview, extensionUri, [
    'webview-ui',
    'build',
    'static',
    'css',
    `${theme}.css`,
  ]);
  // The JS file from the React build output
  const scriptUri = getUri(webview, extensionUri, [
    'webview-ui',
    'build',
    'static',
    'js',
    `${theme}.js`,
  ]);

  const SERVERLESS_DEVS_CONFIG = {
    componentName,
    lang: getLanguage(),
    data: rest,
  };

  // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <link rel="stylesheet" type="text/css" href="${stylesUri}">
        <script>
          window.SERVERLESS_DEVS_CONFIG = ${JSON.stringify(SERVERLESS_DEVS_CONFIG)}
        </script>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        <script nonce="${getNonce()}" src="${scriptUri}"></script>
      </body>
    </html>
  `;
}

export function createWebviewPanel(
  viewType: string,
  title: string,
  viewColumn?: vscode.ViewColumn,
  options?: vscode.WebviewPanelOptions,
) {
  // The editor column the panel should be displayed in
  const newViewColumn = viewColumn || vscode.ViewColumn.One;
  const newOptions = {
    // Enable JavaScript in the webview
    enableScripts: true,
    retainContextWhenHidden: true,
    ...options,
  };
  return vscode.window.createWebviewPanel(viewType, title, newViewColumn, newOptions);
}
