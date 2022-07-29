import * as vscode from 'vscode';
import { init } from '../commands/init';
import * as core from '@serverless-devs/core';
import { activeApplicationWebviewPanel } from '../pages/registry';

export const attrList = {
    "category": {
        "url": "https://registry.devsapp.cn/common/category",
        "id": "categorylist"
    },
    "provider": {
        "url": "https://registry.devsapp.cn/common/provider",
        "id": "providerlist"
    },
    "application": {
        "url": "https://registry.devsapp.cn/package/search",
        "id": "applicationlist"
    }
};

export async function pickCreateMethod(context: vscode.ExtensionContext) {
    const result = await vscode.window.showQuickPick(['模板', 'Registry'], {
        placeHolder: '您希望以哪种方式创建应用？',
    });

    vscode.window.showInformationMessage(`通过${result}创建应用.`);
    if (result === "模板") {
        await init();
    } else if (result === "Registry") {
        activeApplicationWebviewPanel(context);
    }
}

export async function setInitPath() {
    const options: vscode.OpenDialogOptions = {
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: "选择这个路径",
        defaultUri: vscode.Uri.file(core.getRootHome().slice(0, core.getRootHome().lastIndexOf('/'))),
    };
    const selectFolderUri = await vscode.window.showOpenDialog(options);
    if (selectFolderUri) {
        return selectFolderUri[0];
    }
}