import * as vscode from "vscode";
import { getHtmlForWebview } from "../../common";
import * as core from "@serverless-devs/core";
const { lodash: _ } = core;

let addKeyWebviewPanel: vscode.WebviewPanel | undefined;

export async function activaAddKeyWebviewPanel(
    context: vscode.ExtensionContext
) {
    if (addKeyWebviewPanel) {
        addKeyWebviewPanel.reveal();
    } else {
        addKeyWebviewPanel = vscode.window.createWebviewPanel(
            "Serverless-Devs",
            "新增密钥 - Serverless-Devs",
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        async function updateWebview() {
            addKeyWebviewPanel.webview.html = getHtmlForWebview(
                "add-key",
                context,
                addKeyWebviewPanel.webview,
                {
                    items: core.CONFIG_PROVIDERS,
                    configAccessList: core.CONFIG_ACCESS
                }
            );
        }
        await updateWebview();
        addKeyWebviewPanel.iconPath = vscode.Uri.parse(
            "https://img.alicdn.com/imgextra/i4/O1CN01AvqMOu1sYpY1j8xaI_!!6000000005779-2-tps-574-204.png"
        );
        addKeyWebviewPanel.onDidDispose(
            () => {
                addKeyWebviewPanel = undefined;
            },
            null,
            context.subscriptions
        );
        addKeyWebviewPanel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'setCredential':
                    core.setKnownCredential(message.rest, message.provider);
                    vscode.window.showInformationMessage(
                        `Add ${this.pickProvider} configuration successfully.`);
                    return;
                case 'getAccountId':
                    const data = core.getAccountId(this.normalKeyValue);
                    addKeyWebviewPanel.webview.postMessage({
                        
                    })
            }
        }, undefined, context.subscriptions);
    }
}