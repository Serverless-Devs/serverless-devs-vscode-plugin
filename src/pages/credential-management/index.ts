import * as vscode from "vscode";
import { getHtmlForWebview } from "../../common";
import * as core from "@serverless-devs/core";
import { rest, result } from "lodash";
import { deleteCredentialByAccess, getCredentialWithAll, mark } from "../../common/credential";
const { lodash: _ } = core;

let credentialWebviewPanel: vscode.WebviewPanel | undefined;

export async function activaCredentialWebviewPanel(
    context: vscode.ExtensionContext
) {
    if (credentialWebviewPanel) {
        credentialWebviewPanel.reveal();
    } else {
        credentialWebviewPanel = vscode.window.createWebviewPanel(
            "Serverless-Devs",
            "新增密钥 - Serverless-Devs",
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        async function updateWebview() {
            credentialWebviewPanel.webview.html = getHtmlForWebview(
                "credential-management",
                context,
                credentialWebviewPanel.webview,
                {
                    items: core.CONFIG_PROVIDERS,
                    configAccessList: core.CONFIG_ACCESS
                }
            );
        }
        await updateWebview();
        credentialWebviewPanel.iconPath = vscode.Uri.parse(
            "https://img.alicdn.com/imgextra/i4/O1CN01AvqMOu1sYpY1j8xaI_!!6000000005779-2-tps-574-204.png"
        );
        credentialWebviewPanel.onDidDispose(
            () => {
                credentialWebviewPanel = undefined;
            },
            null,
            context.subscriptions
        );
        credentialWebviewPanel.webview.onDidReceiveMessage(async message => {
            switch (message.command) {
                case 'getCredential':
                    const data = await getCredentialWithAll();
                    for (let i in data) {
                        for (let j in data[i]) {
                            data[i][j] = mark(data[i][j]);
                        }
                    }
                    credentialWebviewPanel.webview.postMessage({
                        data: data
                    });
                    break;
                case 'deleteCredential':
                    deleteCredentialByAccess(message.alias);
                    vscode.window.showInformationMessage(
                        `Delete ${message.alias} configuration successfully.`);
                    break;
                case 'setCredential':
                    const { ...rest } = message.kvPairs;
                    if (message.pickProvider === 'alibaba') {
                        core.getAccountId(message.kvPairs).then(
                            result => {
                                message.rest.AccountId = result['AccountId'];
                            }
                        );
                    }
                    core.setKnownCredential(rest, message.alias);
                    vscode.window.showInformationMessage(
                        `Add ${message.alias} configuration successfully.`);
            }
        }, undefined, context.subscriptions);
    }
}
