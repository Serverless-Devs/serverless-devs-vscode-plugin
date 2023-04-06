import * as vscode from 'vscode';
import * as core from '@serverless-devs/core';
import i18n from '../../i18n';
const { lodash: _ } = core;

export async function setDownloadPath(
  { downloadPath }: { downloadPath: string },
  webview: vscode.Webview,
) {
  const options: vscode.OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: i18n('vscode.panels.create_app.choose_this_path'),
    defaultUri: vscode.Uri.file(downloadPath),
  };
  const selectFolderUri = await vscode.window.showOpenDialog(options);
  if (selectFolderUri) {
    const { fsPath } = selectFolderUri[0];
    webview.postMessage({
      eventId: 'setDownloadPath',
      data: {
        downloadPath: fsPath,
      },
    });
  }
}

export async function createApp(data, panel: vscode.WebviewPanel) {
  const { $template, $downloadPath, $alias, $appName, ...rest } = data;
  const appPath = await core.loadApplication({
    source: $template,
    target: $downloadPath,
    name: $appName,
    parameters: rest,
    appName: $appName,
    access: $alias,
  });
  panel.dispose();
  vscode.commands.executeCommand(
    'vscode.openFolder',
    vscode.Uri.file(appPath),
    _.isEmpty(vscode.workspace.workspaceFolders) ? false : true, // 是否在新窗口打开
  );
}
