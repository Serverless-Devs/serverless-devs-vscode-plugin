import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getUri } from "../utils";

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function getHtmlForWebview(
  entryName: string,
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
  config: { [key: string]: any } = {}
) {
  const codiconsUri = getUri(webview, context.extensionUri, [
    "node_modules",
    "@vscode/codicons",
    "dist",
    "codicon.css",
  ]);
  const commonUri = getUri(webview, context.extensionUri, [
    "resources",
    "common.css",
  ]);
  const vueUri = getUri(webview, context.extensionUri, [
    "resources",
    "vue.min.js",
  ]);
  const lodashUri = getUri(webview, context.extensionUri, [
    "resources",
    "lodash.min.js",
  ]);
  const toolkitUri = getUri(webview, context.extensionUri, [
    "node_modules",
    "@vscode",
    "webview-ui-toolkit",
    "dist",
    "toolkit.js", // A toolkit.min.js file is also available
  ]);
  // Use a nonce to only allow specific scripts to be run
  const nonce = getNonce();
  if (config.$loading) {
    return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${codiconsUri}" rel="stylesheet" />
        <link href="${commonUri}" rel="stylesheet" />
        <script nonce="${nonce}" type="module" src="${toolkitUri}"></script>
      </head>
      <body class="loading">
        <vscode-progress-ring></vscode-progress-ring>
        <div class="ml8">Loading...</div>
      </body>
    </html>
  `;
  }

  // ui路径下自定义部分
  const indexHtml = path.join(
    context.extensionPath,
    "src",
    "pages",
    entryName,
    "ui",
    "index.html"
  );
  const mainUri = getUri(webview, context.extensionUri, [
    "src",
    "pages",
    entryName,
    "ui",
    "main.js",
  ]);
  const customCssUri = getUri(webview, context.extensionUri, [
    "src",
    "pages",
    entryName,
    "ui",
    "index.css"
  ]);

  // 传入模版的数据挂载到 Vue.prototype.$config 上
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${codiconsUri}" rel="stylesheet" />
        <link href="${commonUri}" rel="stylesheet" />
        <link href="${customCssUri}" rel="stylesheet" />

        <script nonce="${nonce}" type="module" src="${toolkitUri}"></script>
        <script src="${vueUri}"></script>
        <script src="${lodashUri}"></script>
        <script nonce="${nonce}">
          Vue.prototype.$config = ${JSON.stringify(config)};
        </script>
      </head>
      <body>
        ${fs.readFileSync(indexHtml, "utf-8")}
      </body>
      <script nonce="${nonce}" type="module" src="${mainUri}"></script>
    </html>
  `;
}
