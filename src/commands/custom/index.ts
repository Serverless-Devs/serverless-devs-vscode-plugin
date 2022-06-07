import * as vscode from "vscode";
import * as path from "path";
import { ext } from "../../extensionVariables";
import { ItemData } from "../../common";
import * as core from "@serverless-devs/core";

let terminal: vscode.Terminal | undefined;
export async function custom(itemData: ItemData) {
  // TODO： 使用同一个terminal 连续部署两次存在问题
  if (!terminal) {
    terminal = vscode.window.createTerminal("Serverless Devs#1");
  }
  terminal.sendText(itemData.scommand);
  terminal.show();
}
