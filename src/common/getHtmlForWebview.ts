import * as vscode from "vscode";
import * as path from "path";
import { getUri } from "../utils";
const template = require("art-template");

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
  const indexArt = path.join(
    context.extensionPath,
    "src",
    entryName,
    "ui",
    "index.art"
  );
  const indexHtml = template(indexArt, config);

  const toolkitUri = getUri(webview, context.extensionUri, [
    "node_modules",
    "@vscode",
    "webview-ui-toolkit",
    "dist",
    "toolkit.js", // A toolkit.min.js file is also available
  ]);

  const mainUri = getUri(webview, context.extensionUri, [
    "src",
    entryName,
    "ui",
    "main.js",
  ]);

  // Use a nonce to only allow specific scripts to be run
  const nonce = getNonce();

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script nonce="${nonce}" type="module" src="${toolkitUri}"></script>
      </head>
      ${indexHtml}
      <script nonce="${nonce}" src="${mainUri}"></script>
    </html>
  `;
}
