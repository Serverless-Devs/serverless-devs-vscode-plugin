import * as vscode from "vscode";
import { getHtmlForWebview, updateWebview } from "../../common";
import * as core from "@serverless-devs/core";
import { rest, result } from "lodash";
import { deleteCredentialByAccess, getCredentialWithAll, mark } from "../../common/credential";
const { lodash: _ } = core;

let credentialWebviewPanel: vscode.WebviewPanel | undefined;

export async function activeCredentialWebviewPanel(
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
    await updateWebview(credentialWebviewPanel, 'credential-management', context, {
      items: core.CONFIG_PROVIDERS,
      configAccessList: core.CONFIG_ACCESS,
      data: await getCredentialWithAll()
    });

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
    credentialWebviewPanel.webview.onDidReceiveMessage(
      (message) => {
        handleMessage(context, message);
      }
      , undefined,
      context.subscriptions);
  }
}


async function handleMessage(
  context: vscode.ExtensionContext,
  message: any
) {
  switch (message.command) {
    case 'getCredential':
      const data = await getCredentialWithAll();
      credentialWebviewPanel.webview.postMessage({
        data: data
      });
      break;
    case 'deleteCredential':
      try {
        const res = await vscode.window.showInformationMessage(
          `Are you sure to delete ${message.alias} configuration?`, '确认删除', '取消');
        console.log(res);
        if (res === '确认删除') {
          await deleteCredentialByAccess(message.alias);
          updateWebview(credentialWebviewPanel, 'credential-management', context, {
            items: core.CONFIG_PROVIDERS,
            configAccessList: core.CONFIG_ACCESS,
            data: await getCredentialWithAll()
          });
        }
      } catch (e) {
        vscode.window.showInformationMessage(
          `Delete ${message.alias} configuration failed.`);
      }
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
      await core.setKnownCredential(rest, message.alias);
      vscode.window.showInformationMessage(
        `Add ${message.alias} configuration successfully.`);
      updateWebview(credentialWebviewPanel, 'credential-management', context, {
        items: core.CONFIG_PROVIDERS,
        configAccessList: core.CONFIG_ACCESS,
        data: await getCredentialWithAll()
      });
  }
}