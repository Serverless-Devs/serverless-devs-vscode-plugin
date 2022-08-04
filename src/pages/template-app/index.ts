import * as vscode from 'vscode';
import * as path from 'path';
import * as core from "@serverless-devs/core";
import { updateWebview } from '../../common';
import LoadApplication from '../../common/loadApplication';
import { attrList, setInitPath } from '../../common/createApp';
const { lodash: _ } = core;
const fetch = require('node-fetch');
var qs = require('qs');

let templateAppWebviewPanel: vscode.WebviewPanel | undefined;
let applicationInstance: LoadApplication;


export async function activeTemplateAppWebviewPanel(
  context: vscode.ExtensionContext,
  appParams: any
) {
  if (templateAppWebviewPanel) {
    templateAppWebviewPanel.reveal();
  } else {
    templateAppWebviewPanel = vscode.window.createWebviewPanel(
      "Serverless-Devs",
      "通过模板进行应用创建 - Serverless-Devs",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    const params = await fetch(attrList['params']['url'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({ 'name': appParams.source })
    }).then(res => res.json());
    await updateWebview(templateAppWebviewPanel, 'template-app', context, {
      params: params.Response,
      access: appParams.access,
      templateName: appParams.source,
      defaultPath: core.getRootHome().slice(0, core.getRootHome().lastIndexOf('/'))
    });

    templateAppWebviewPanel.onDidDispose(
      () => {
        templateAppWebviewPanel = undefined;
      },
      null,
      context.subscriptions
    );

    templateAppWebviewPanel.webview.onDidReceiveMessage(
      (message) => {
        handleMessage(message);
      }
      , undefined,
      context.subscriptions
    );
  }
}

async function handleMessage(
  message: any
) {
  switch (message.command) {
    case 'setInitPath':
      const selectPath = await setInitPath();
      if (selectPath) {
        templateAppWebviewPanel.webview.postMessage({
          command: 'updatePath',
          path: selectPath['path']
        });
      }
    case 'initApplication':
      const config = {
        source: message.templateName,
        access: message.access,
        target: message.configItems.path,
        appName: message.configItems.dirName,
      };
      applicationInstance = new LoadApplication(config,'template');
      await applicationInstance.loadServerless();
      vscode.window.showInformationMessage(`应用已下载到${config.target}/${config.appName}`);
      applicationInstance.setSconfigToLocal(message.configItems);
      const newWindow = !!vscode.workspace.rootPath;
      if (newWindow) { templateAppWebviewPanel.dispose(); }
      vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(applicationInstance.applicationPath), newWindow);
      break;
  }
}
