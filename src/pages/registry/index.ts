import * as vscode from 'vscode';
import { setPanelIcon, updateWebview } from '../../common';
import * as core from "@serverless-devs/core";
import * as open from "open";
import { attrList, initProject, responseData, setInitPath } from '../../common/createApp';
const { lodash: _ } = core;
const fetch = require('node-fetch');
var qs = require('qs');

let applicationWebviewPanel: vscode.WebviewPanel | undefined;

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

    const categoryFetch = await fetch(attrList['category']['url']);
    const applicationFetch = await fetch(attrList['application']['url']);
    await updateWebview(applicationWebviewPanel, 'registry', context, {
      categoryList: await categoryFetch.json(),
      applicationList: await applicationFetch.json(),
      aliasList: await core.getCredentialAliasList(),
      defaultPath: core.getRootHome().slice(0, core.getRootHome().lastIndexOf('/'))
    });
    await setPanelIcon(applicationWebviewPanel);
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
    case 'requestData':
      responseData(applicationWebviewPanel, message.sort);
      break;

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

    case 'getParams':
      const params = await fetch(attrList['params']['url'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify({ 'name': message.selectedApp })
      }).then(res => res.json());
      applicationWebviewPanel.webview.postMessage({
        command: 'getParams',
        params: params.Response
      });
      break;

    case 'initApplication':
      const config = {
        source: message.selectedApp,
        target: message.configItems.path,
        name: message.configItems.dirName,
        appName: message.configItems.dirName,
        access: message.configItems.access,
        parameters: message.configItems
      };
      initProject(applicationWebviewPanel, config);
      break;
  }
}