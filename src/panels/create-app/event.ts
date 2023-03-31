import * as vscode from 'vscode';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as core from '@serverless-devs/core';
const { lodash: _, jsyaml: yaml, fse: fs } = core;

export async function setDownloadPath(
  { downloadPath }: { downloadPath: string },
  webview: vscode.Webview,
) {
  const options: vscode.OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: '选择这个路径',
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
