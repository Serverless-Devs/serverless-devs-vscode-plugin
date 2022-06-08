import * as vscode from "vscode";
import * as path from "path";
import { ext } from "../../extensionVariables";
import { ItemData } from "../../common";
import * as core from "@serverless-devs/core";
import { TERMINAL_NAME } from "../../constants";

export async function custom(itemData: ItemData) {
  const terminals = vscode.window.terminals;
  for (const item of terminals) {
    if (item.name === TERMINAL_NAME) {
      item.dispose();
    }
  }
  const terminal = vscode.window.createTerminal(TERMINAL_NAME);
  terminal.sendText(itemData.scommand);
  terminal.show();
}
