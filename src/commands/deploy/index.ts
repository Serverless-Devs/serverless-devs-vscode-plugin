import * as vscode from "vscode";
import * as path from "path";
import { ext } from "../../extensionVariables";
import { ItemData } from "../../common";
import * as core from "@serverless-devs/core";

export async function deploy(itemData: ItemData) {
  vscode.window.showInformationMessage("this message from deploy");
  const spath = path.join(ext.cwd, "s.yaml");
  const hasYaml = await core.getYamlContent(spath);
  if (hasYaml) {
    const terminal = vscode.window.createTerminal(
      `deploy from Serverless Devs`
    );
    terminal.show();
    terminal.sendText(itemData.scommand);
  }
}
