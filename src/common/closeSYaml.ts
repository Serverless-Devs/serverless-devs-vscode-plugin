import * as vscode from "vscode";
import * as path from 'path';
import * as fs from "fs";
import { markYaml } from "../commands/mark-yaml";
import { ext } from "../extensionVariables";
import { TEMPLTE_FILE } from "../constants";

export function closeSYaml(document: vscode.TextDocument) {
  const fsPath = document.uri.fsPath;
  if (document.languageId === 'yaml') {
    const relativePath = fsPath.replace(`${ext.cwd}/`, '');
    if (!configIsExsit(relativePath)) {
      vscode.window.showInformationMessage(
        'This YAML is not marked, do you want to mark it?',
        { modal: true },
        ...['Yes']
      ).then((e) => {
        if (e === 'Yes') {
          const uri = vscode.Uri.file(fsPath);
          markYaml(uri);
        }
      });
    }
  }
}

function configIsExsit(relativePath: string) {
  const configPath = path.join(ext.cwd, TEMPLTE_FILE);
  if (fs.existsSync(configPath)) {
    const data = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    for (const item of data['marked-yamls']) {
      if (item['path'] === relativePath) { return true; }
    }
  }
  return false;
}