import * as vscode from 'vscode';
import { getHtmlForWebview } from '../../common';
import loadApplication from '../../common/loadApplication';
import * as core from "@serverless-devs/core";
import * as open from "open";
import { attrList, setInitPath } from '../../common/createApp';
import LoadApplication from '../../common/loadApplication';
const { lodash: _ } = core;
const fetch = require('node-fetch');

let applicationWebviewPanel: vscode.WebviewPanel | undefined;
let applicationInstance: LoadApplication;

export async function activeApplicationWebviewPanel(
  context: vscode.ExtensionContext
) {
  if (applicationWebviewPanel) {
    applicationWebviewPanel.reveal();
  } else {
    applicationWebviewPanel = vscode.window.createWebviewPanel(
      "Serverless-Devs",
      "应用创建 - Serverless-Devs",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );
    async function updateWebview() {
      const categoryFetch = await fetch(attrList['category']['url']);
      const providerFetch = await fetch(attrList['provider']['url']);
      const applicationFetch = await fetch(attrList['application']['url']);
      applicationWebviewPanel.webview.html = getHtmlForWebview(
        "registry",
        context,
        applicationWebviewPanel.webview,
        {
          categoryList: await categoryFetch.json(),
          providerList: await providerFetch.json(),
          applicationList: await applicationFetch.json(),
          aliasList: await core.getCredentialAliasList(),
          defaultPath: core.getRootHome().slice(0, core.getRootHome().lastIndexOf('/'))
        }
      );
    }
    await updateWebview();
    applicationWebviewPanel.iconPath = vscode.Uri.parse(
      "https://img.alicdn.com/imgextra/i4/O1CN01AvqMOu1sYpY1j8xaI_!!6000000005779-2-tps-574-204.png"
    );
    applicationWebviewPanel.onDidDispose(
      () => {
        applicationWebviewPanel = undefined;
      },
      null,
      context.subscriptions
    );
    applicationWebviewPanel.webview.onDidReceiveMessage(
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
    case 'openUrl':
      open('https://www.devsapp.cn/details.html?name=' + message.appName);
      break;
    case 'setInitPath':
      const selectPath = await setInitPath();
      if (selectPath) {
        applicationWebviewPanel.webview.postMessage({
          command: 'updatePath',
          path: selectPath['path']
        });
      }
      break;
    case 'downloadApp':
      const config = {
        source: message.selectedApp,
        target: message.configItems.path,
        appName: message.configItems.dirName,
        access: message.configItems.access
      };
      applicationInstance = new LoadApplication(config);
      await applicationInstance.loadServerless();
      const requireConfig = await applicationInstance.getSconfig();
      applicationWebviewPanel.webview.postMessage({
        command: 'setConfig',
        requireConfig
      });
      vscode.window.showInformationMessage(`应用已下载到${config.target}/${config.appName}`);
      break;
    case 'applyConfigToLocal':
      applicationInstance.setSconfigToLocal(message.requireConfig);
      const newWindow = !!vscode.workspace.rootPath;
      if (newWindow) {applicationWebviewPanel.dispose();}
      vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(applicationInstance.applicationPath), newWindow);
      break;
  }
}