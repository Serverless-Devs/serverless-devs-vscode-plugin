import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import * as core from "@serverless-devs/core";
import { ext } from "../../../extensionVariables";
import { TEMPLTE_FILE } from "../../../constants";

export async function quickCommandList(params) {
  const { quickCommandList, itemData } = params;
  const filePath = path.join(ext.cwd, TEMPLTE_FILE);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (Array.isArray(data["quick-commands"])) {
    const findObj = data["quick-commands"].find(
      (item) => item.path === itemData.spath
    );
    if (findObj) {
      data["quick-commands"] = data["quick-commands"].map((item) => {
        if (item.path === itemData.spath) {
          item.data = quickCommandList;
        }
        return item;
      });
    } else {
      data["quick-commands"].push({
        path: itemData.spath,
        data: quickCommandList,
      });
    }
  } else {
    data["quick-commands"] = [
      {
        path: itemData.spath,
        data: quickCommandList,
      },
    ];
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function resetWorkspace() {
  const filePath = path.join(os.homedir(), ".s");
  core.setConfig("workspace", filePath);
  vscode.window.showInformationMessage("Setup succeeded");
}

export async function mangeWorkspace() {
  const options: vscode.OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: "Open",
    defaultUri: vscode.Uri.file(core.getRootHome()),
  };
  const selectFolderUri = await vscode.window.showOpenDialog(options);
  if (selectFolderUri) {
    const { fsPath } = selectFolderUri[0];
    core.setConfig("workspace", fsPath);
    vscode.window.showInformationMessage("Setup succeeded");
  }
}
